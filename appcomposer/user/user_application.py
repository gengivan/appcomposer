from flask import redirect, request, url_for, flash
from flask.ext.admin import Admin, BaseView, expose
from flask.ext.wtf import TextField, Form, PasswordField
from wtforms import ValidationError, validators
from .fields import DisabledTextField
from appcomposer import db
from appcomposer.login import current_user, create_salted_password
from appcomposer.babel import lazy_gettext
from appcomposer.appstorage import api as appstorage

# List of all available composers
from appcomposer.application import COMPOSERS, COMPOSERS_DICT


def initialize_user_component(app):
    # Initialize the Admin
    # URL describes through which address we access the page.
    # Endpoint enables us to do url_for('userp') to yield the URL
    url = '/user'
    admin = Admin(index_view=HomeView(url=url, endpoint='user', name=lazy_gettext("Home")),
                  name=lazy_gettext("User Profile"), url=url, endpoint="home-user")
#    admin.add_view(ProfileEditView(name=lazy_gettext("Profile"), url='profile', endpoint='user.profile'))
    admin.add_view(AppsView(name=lazy_gettext("Apps"), url="apps", endpoint='user.apps'))
    admin.init_app(app)


class UserBaseView(BaseView):
    """
    View that will probably be used as base for all other User views.
    It includes common functionality such as logged-in verification.
    """

    def is_accessible(self):
        return current_user() is not None

    def _handle_view(self, *args, **kwargs):
        if not self.is_accessible():
            return redirect(url_for('login', next=request.url))

        return super(UserBaseView, self)._handle_view(*args, **kwargs)


class EditView(UserBaseView):
    """
    Edit View. The view used to view and edit common user information such as
    email, name, etc.
    """

    @expose('/')
    def index(self):
        return self.render("user/index.html")


class HomeView(UserBaseView):
    """
    Home View. Standard entry view which lets us choose a composer with which to create a new app.
    """

    @expose('/')
    def index(self):
        return self.render('user/index.html', composers=COMPOSERS)


class ProfileEditForm(Form):
    """
    The form used for the Profile Edit view.
    """
    name = DisabledTextField(lazy_gettext(u"Name:"))
    login = DisabledTextField(lazy_gettext(u"Login:"))
    email = TextField(lazy_gettext(u"E-mail:"))
    password = PasswordField(lazy_gettext(u"Password:"),
                             [validators.EqualTo("password_rep", message="Passwords must match")])
    password_rep = PasswordField(lazy_gettext(u"Password again:"))
    organization = TextField(lazy_gettext(u"Organization:"))
    role = TextField(lazy_gettext(u"Role:"))
    creation_date = DisabledTextField(lazy_gettext(u"Creation date:"))
    last_access_date = DisabledTextField(lazy_gettext(u"Last access:"))
    auth_system = TextField(lazy_gettext(u"Auth system:"))


def build_edit_link(app):
    if app.composer not in COMPOSERS_DICT:
        return ""
    endpoint = COMPOSERS_DICT[app.composer]["edit_endpoint"]
    return url_for(endpoint, appid=app.unique_id)


def build_duplicate_link(app):
    if app.composer not in COMPOSERS_DICT:
        return ""
    if 'duplicate_endpoint' not in COMPOSERS_DICT[app.composer]:
        return ""
    endpoint = COMPOSERS_DICT[app.composer]["duplicate_endpoint"]
    return url_for(endpoint, appid=app.unique_id)


def build_delete_link(app):
    if app.composer not in COMPOSERS_DICT:
        return ""
    endpoint = COMPOSERS_DICT[app.composer]["delete_endpoint"]
    return url_for(endpoint, appid=app.unique_id)


class AppsView(UserBaseView):
    """
    Apps View. Will list all the apps owned by someone. He will be able to edit and delete them,
    and in the future will probably offer some additional options.
    """

    def __init__(self, *args, **kwargs):
        super(UserBaseView, self).__init__(*args, **kwargs)

    @expose('/')
    def index(self):
        # Retrieve the apps
        apps = appstorage.get_my_apps()[::-1]

        return self.render('user/profile-apps.html', apps=apps, build_edit_link=build_edit_link,
                           build_delete_link=build_delete_link, build_duplicate_link=build_duplicate_link, composers=COMPOSERS)


def passwords_match(form, field):
    if form.password.data != form.password_rep.data:
        raise ValidationError("Passwords don't match")


class ProfileEditView(UserBaseView):
    def __init__(self, *args, **kwargs):
        super(ProfileEditView, self).__init__(*args, **kwargs)

    @expose(methods=['GET', 'POST'])
    def index(self):
        """
        index(self)
        
        This method will be invoked for the Profile Edit view. This view is used for both viewing and updating
        the user profile. It exposes both GET and POST, for viewing and updating respectively.
        """

        # This will be passed as a template parameter to let us change the password.
        # (And display the appropriate form field).
        change_password = True

        user = current_user()
        if user is None:
            return redirect("login")

        # If it is a POST request to edit the form, then request.form will not be None
        # Otherwise we will simply load the form data from the DB
        if len(request.form):
            form = ProfileEditForm(request.form, csrf_enabled=True)
        else:
            # It was a GET request (just viewing). 
            form = ProfileEditForm(csrf_enabled=True)
            form.name.data = user.name
            form.login.data = user.login
            form.email.data = user.email
            form.organization.data = user.organization
            form.role.data = user.role
            form.creation_date.data = user.creation_date
            form.last_access_date.data = user.last_access_date
            form.auth_system.data = user.auth_system
            form.password.data = user.auth_data

        # If the method is POST we assume that we want to update and not just view
        if request.method == "POST" and form.validate_on_submit():
            # It was a POST request, the data (which has been modified) will be contained in
            # the request. For security reasons, we manually modify the user for these
            # settings which should actually be modifiable.
            user.email = form.email.data
            user.organization = form.organization.data
            user.role = form.role.data
            user.auth_type = form.auth_system.data  # Probably in the release we shouldn't let users modify the auth this way
            if len(form.password.data) > 0:
                new_password_data = create_salted_password(form.password.data)
                user.auth_data = new_password_data
            db.session.add(user)
            db.session.commit()

            flash("Changes saved", "success")

        return self.render("user/profile-edit.html", user=user, form=form, change_password=change_password)
