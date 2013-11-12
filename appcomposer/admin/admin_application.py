from flask import redirect, request, flash, session, render_template_string, url_for
from flask.ext.admin import Admin, BaseView, AdminIndexView, expose
from flask.ext.admin.contrib.sqlamodel import ModelView

from flask.ext import wtf
from wtforms.fields import PasswordField
from wtforms.validators import Email, Regexp

from appcomposer import models
from appcomposer.login import current_user
from appcomposer.db import db_session

from appcomposer.application import COMPOSERS_DICT

##########################################################
#
# Initialization
# 

def initialize_admin_component(app):
    # Initialize the Admin
    # URL describes through which address we access the page.
    # Endpoint enables us to do url_for('userp') to yield the URL
    url = '/admin'
    admin = Admin(index_view = AdminView(url = url, endpoint = 'admin'), name='Admin Profile', endpoint = "home-admin")
    admin.add_view(UsersView(db_session, name='Users', url = 'users', endpoint = 'admin.users'))
    admin.add_view(BasicAdminAppsView(db_session, name='Basic Management', url = 'basic-apps-admin', endpoint = 'admin.basic-admin-apps', category='Applications'))    
    admin.add_view(AdvancedAdminAppsView(name='Advanced Management', url = 'advanced-apps-admin', endpoint = 'admin.advanced-admin-apps', category='Applications'))   
    admin.add_view(ProfileView(name='My Profile', url = 'profile', endpoint = 'admin.profile'))
    admin.add_view(BackView(name='Back', url = 'back', endpoint = 'admin.back'))     
    admin.init_app(app)

# Regular expression to validate the "login" field
LOGIN_REGEX = '^[A-Za-z0-9\._-][A-Za-z0-9\._-][A-Za-z0-9\._-][A-Za-z0-9\._-]*$'

#####################################################################
#
#
# Parent views
#
# 

class MyAdminIndexView(AdminIndexView):
    """
    View that will be used as index for Admin.
    """

    def is_accessible(self):
        self._current_user = current_user()
        return self._current_user is not None

    def _handle_view(self, *args, **kwargs):
        if not self.is_accessible():
            return redirect(url_for('login', next=request.url))
        
        # Just call parent class with predefined model
        return super(MyAdminIndexView, self)._handle_view(*args, **kwargs)


class AdminBaseView(BaseView):
    """
    View that will be used as base for some Admin views (with external templates).
    """

    def is_accessible(self):
        self._current_user = current_user()
        return self._current_user is not None

    def _handle_view(self, *args, **kwargs):
        if not self.is_accessible():
            return redirect(url_for('login', next=request.url))
        
        # Just call parent class with predefined model
        return super(AdminBaseView, self)._handle_view(*args, **kwargs)


class AdminModelView(ModelView):
    """
    View that will be used as model for some Admin views (without external templates).
    """

    def is_accessible(self):
        self._current_user = current_user()
        return self._current_user is not None

    def _handle_view(self, *args, **kwargs):
        if not self.is_accessible():
            return redirect(url_for('login', next=request.url))
        
        # Just call parent class with predefined model
        return super(AdminModelView, self)._handle_view(*args, **kwargs)


##############################################################
#
# Main views
# 

class AdminView(MyAdminIndexView):
    """
    Admin View. Standard entry view which lets us see the index page.
    """
    
    @expose('/')
    def index(self):       
        return self.render('admin/index.html')


class UsersView(AdminModelView):
    """
    Users View. Entry view which lets us manage the users in the system.
    """
    
    column_list = ('login', 'name', 'email', 'organization', 'role')

    column_labels = dict(login = 'Login', name = 'Full Name', email = 'E-mail', organization = 'Organization', role = 'Role')
    column_filters = ('login', 'name', 'email', 'organization', 'role')

    form_args = dict(email=dict(validators=[Email()]), login=dict(validators=[Regexp(LOGIN_REGEX)]))

    column_descriptions = dict(login='Username (all letters, dots and numbers)',
                               name='First and Last name',
                               email='Valid e-mail address')

    # List of columns that can be sorted
    column_sortable_list = ('login', 'name', 'email', 'organization', 'role')
  
    # Columns that can used for searches
    column_searchable_list = ('login', 'name', 'email', 'organization', 'role')
 
    # Fields used for the creations of new users    
    form_columns = ('login', 'name', 'email', 'organization', 'role', 'password', 'creation_date', 'last_access_date')
    form_overrides = dict(access_level=wtf.SelectField, password=PasswordField)    
    
    def __init__(self, session, **kwargs):
        super(UsersView, self).__init__(models.User, session, **kwargs)


class BasicAdminAppsView(AdminModelView):
    """
    Basic Admin Apps View. Basic entry view which lets us manage the applications located at the system.
    We will be able to create, edit, and delete apps.
    """

    column_list = ('owner', 'name', 'composer', 'data', 'creation_date', 'modification_date', 'last_access_date')
    column_labels = dict(owner = 'Owner', name = 'Name', composer = 'Composer', data = 'Data', creation_date = 'Creation Date', modification_date = 'Modification Date', last_access_date = 'Last Access Date')
    column_sortable_list = ('owner', 'name', 'composer')
    column_searchable_list = ('name', 'composer')
    
    def __init__(self, session, **kwargs):
        super(BasicAdminAppsView, self).__init__(models.App, session, **kwargs)


class AdvancedAdminAppsView(AdminBaseView):
    """
    Advanced Admin Apps View. Advanced entry view which lets us manage the applications located at the system. 
    We will be able to create, edit, and delete apps.
    """

    @expose('/')
    def index(self):
        # Retrieve the apps
        apps = db_session.query(models.App).all()
        
        def build_edit_link(app):
            endpoint = COMPOSERS_DICT[app.composer]["edit_endpoint"]
            return url_for(endpoint, appid=app.unique_id)

        def build_delete_link(app):
            endpoint = COMPOSERS_DICT[app.composer]["delete_endpoint"]
            return url_for(endpoint, appid=app.unique_id)

        return self.render('admin/advanced-admin-apps.html', apps=apps, build_edit_link=build_edit_link,
                           build_delete_link=build_delete_link)


class ProfileView(AdminBaseView):
    """
    Profile View. Entry view which lets us edit our profile.
    """
    
    @expose('/')
    def index(self):       
        return self.render('admin/profile-edit.html')


class BackView(AdminBaseView):
    """
    Back View.Entry view which lets us come back to the initial page.
    """
    
    @expose('/')
    def index(self):       
        return self.render('index.html')
