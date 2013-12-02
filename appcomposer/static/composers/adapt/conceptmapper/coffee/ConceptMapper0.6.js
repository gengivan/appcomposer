// Generated by CoffeeScript 2.0.0-beta7
window.ut = window.ut || {};
window.ut.tools = window.ut.tools || {};
window.ut.tools.conceptmapper = window.ut.tools.conceptmapper || {};
window.ut.tools.conceptmapper.ConceptMapper = function () {
  function ConceptMapper(actionlogger, param$) {
    var instance$;
    instance$ = this;
    this.setConceptMapFromJSON = function (a) {
      return ConceptMapper.prototype.setConceptMapFromJSON.apply(instance$, arguments);
    };
    this.loadConceptMap = function () {
      return ConceptMapper.prototype.loadConceptMap.apply(instance$, arguments);
    };
    this.connectionExists = function (a, b) {
      return ConceptMapper.prototype.connectionExists.apply(instance$, arguments);
    };
    this.activateJsPlumbEdgeMode = function (a) {
      return ConceptMapper.prototype.activateJsPlumbEdgeMode.apply(instance$, arguments);
    };
    this.onClickEdgeHandler = function (a) {
      return ConceptMapper.prototype.onClickEdgeHandler.apply(instance$, arguments);
    };
    this.deleteAll = function () {
      return ConceptMapper.prototype.deleteAll.apply(instance$, arguments);
    };
    this.onClickHandlerTrashcan = function () {
      return ConceptMapper.prototype.onClickHandlerTrashcan.apply(instance$, arguments);
    };
    this.onBlurHandlerInjectRelation = function (a) {
      return ConceptMapper.prototype.onBlurHandlerInjectRelation.apply(instance$, arguments);
    };
    this.onClickHandlerConnectionLabel = function (a) {
      return ConceptMapper.prototype.onClickHandlerConnectionLabel.apply(instance$, arguments);
    };
    this.onClickHandlerInjectCombobox = function (a) {
      return ConceptMapper.prototype.onClickHandlerInjectCombobox.apply(instance$, arguments);
    };
    this.onClickHandlerInjectTextarea = function (a) {
      return ConceptMapper.prototype.onClickHandlerInjectTextarea.apply(instance$, arguments);
    };
    this.initDnD = function () {
      return ConceptMapper.prototype.initDnD.apply(instance$, arguments);
    };
    this.init = function () {
      return ConceptMapper.prototype.init.apply(instance$, arguments);
    };
    if (null == param$)
      param$ = [
        'length',
        'mass',
        'time',
        'electric current',
        'thermodynamic temperature',
        'amount of substance',
        'luminous intensity'
      ];
    this.availableConcepts = param$;
    console.log('Initializing ConceptMapper0.6.');
    if (actionlogger instanceof ut.commons.actionlogging.ActionLogger)
      this.actionlogger = actionlogger;
    this.availableRelations = [
      'is',
      'is part of',
      'has',
      'leads to',
      'influences',
      'increases',
      'decreases'
    ];
    this.LINK_MODE = 'link_mode';
    this.NODE_MODE = 'node_mode';
    this.mode = this.NODE_MODE;
    this.sourceNode = void 0;
    this.targetNode = void 0;
    this.editingLabel = void 0;
    this.storage = void 0;
    this.debug = true;
    this.init();
  }
  ConceptMapper.prototype.logAction = function (type) {
    if (this.actionlogger)
      return this.actionlogger.log(type);
  };
  ConceptMapper.prototype.init = function () {
    console.log('Available concepts: ' + this.availableConcepts);
    $('#ut_tools_conceptmapper_linkButton').click(function (this$) {
      return function () {
        if (this$.mode === this$.LINK_MODE) {
          return this$.setMode(this$.NODE_MODE);
        } else {
          return this$.setMode(this$.LINK_MODE);
        }
      };
    }(this));
    this.storage = new ut.commons.persistency.FileStorage;
    $('#ut_tools_conceptmapper_store').click(function (this$) {
      return function () {
        return this$.storage.storeAsFile(this$.getConceptMapAsJSon(), 'conceptmap.json');
      };
    }(this));
    $('#ut_tools_conceptmapper_retrieve').click(this.loadConceptMap);
    this.initDnD();
    this.initJsPlumb();
    return ut.commons.utils.gadgetResize();
  };
  ConceptMapper.prototype.initDnD = function () {
    $('#ut_tools_conceptmapper_toolbar .ut_tools_conceptmapper_concept').draggable({
      helper: 'clone',
      cursor: 'move',
      containment: '#ut_tools_conceptmapper_root'
    });
    $('#ut_tools_conceptmapper_map').bind('dragover', function (event) {
      return false;
    });
    $('#ut_tools_conceptmapper_map').droppable();
    $('#ut_tools_conceptmapper_map').bind('drop', function (this$) {
      return function (event, ui) {
        if (ui && $(ui.draggable).hasClass('ut_tools_hypothesis_condition')) {
          return false;
        } else if (ui && $(ui.draggable).hasClass('ut_tools_conceptmapper_template')) {
          console.log('Concept template dropped. Clone and add to map.');
          if ($(ui.draggable).hasClass('ut_tools_conceptmapper_conceptTextarea')) {
            this$.createConcept(ut.commons.utils.generateUUID(), $(ui.draggable).text(), ui.position.left, ui.position.top, 'ut_tools_conceptmapper_conceptTextarea');
          } else if ($(ui.draggable).hasClass('ut_tools_conceptmapper_conceptSelector')) {
            this$.createConcept(ut.commons.utils.generateUUID(), $(ui.draggable).text(), ui.position.left, ui.position.top, 'ut_tools_conceptmapper_conceptSelector');
          }
        } else if (event.originalEvent.dataTransfer) {
          this$.createConcept(ut.commons.utils.generateUUID(), event.originalEvent.dataTransfer.getData('Text'), event.originalEvent.clientX, event.originalEvent.clientY, 'ut_tools_conceptmapper_conceptTextarea');
        }
        return false;
      };
    }(this));
    $('#ut_tools_conceptmapper_trashcan').click(this.onClickHandlerTrashcan);
    $('#ut_tools_conceptmapper_trashcan').droppable({
      accept: '.ut_tools_conceptmapper_concept',
      drop: function (this$) {
        return function (event, ui) {
          return this$.removeConcept(ui.draggable);
        };
      }(this)
    });
    return this.logAction('conceptmapper_started');
  };
  ConceptMapper.prototype.initJsPlumb = function () {
    var jsPlumbDefaults;
    jsPlumbDefaults = {
      Connector: [
        'Bezier',
        { curviness: 500 }
      ],
      ConnectorZIndex: 0,
      DragOptions: {
        cursor: 'pointer',
        zIndex: 2e3
      },
      PaintStyle: {
        strokeStyle: '#00b7cd',
        lineWidth: 4
      },
      EndpointStyle: {},
      Anchor: [
        'Perimeter',
        { shape: 'Ellipse' }
      ],
      ConnectionOverlays: [
        [
          'Arrow',
          { location: .7 },
          {
            foldback: .7,
            fillStyle: '#00b7cd',
            width: 20
          }
        ],
        [
          'Label',
          {
            label: 'is a',
            location: .5,
            id: 'label'
          }
        ]
      ],
      Detachable: false,
      Reattach: false
    };
    jsPlumb.importDefaults(jsPlumbDefaults);
    jsPlumb.setRenderMode(jsPlumb.SVG);
    return jsPlumb.bind('jsPlumbConnection', function (this$) {
      return function (connection) {
        return connection.connection.getOverlay('label').bind('click', this$.onClickHandlerConnectionLabel);
      };
    }(this));
  };
  ConceptMapper.prototype.initConceptMapDropHandler = function () {
    $('#ut_tools_conceptmapper_map').bind('dragover', function (ev) {
      return false;
    });
    $('#ut_tools_conceptmapper_map').droppable();
    return $('#ut_tools_conceptmapper_map').bind('drop', function (event, ui) {
      if (ui && $(ui.draggable).hasClass('ut_tools_hypothesis_condition')) {
        return false;
      } else if (ui && $(ui.draggable).hasClass('ut_tools_conceptmapper_template')) {
        console.log('Concept template dropped. Clone and add to map.');
      } else if (event.originalEvent.dataTransfer) {
        createConcept(ut.commons.utils.generateUUID(), event.originalEvent.dataTransfer.getData('Text'), event.originalEvent.clientX, event.originalEvent.clientY, 'ut_tools_conceptmapper_conceptTextarea');
      }
      return false;
    });
  };
  ConceptMapper.prototype.createConcept = function (id, conceptText, x, y, className) {
    var newConcept;
    newConcept = $('<div>');
    newConcept.attr('id', id);
    newConcept.addClass('ut_tools_conceptmapper_concept');
    newConcept.append($('<p/>').html(nl2br(conceptText)));
    jsPlumb.draggable(newConcept, {
      containment: '#ut_tools_conceptmapper_root',
      cursor: 'move',
      revert: 'invalid',
      iframeFix: true,
      delay: 50
    });
    newConcept.css('position', 'absolute');
    newConcept.css('top', y);
    newConcept.css('left', x);
    newConcept.addClass(className);
    if (className === 'ut_tools_conceptmapper_conceptTextarea') {
      newConcept.click(this.onClickHandlerInjectTextarea);
    } else {
      newConcept.click(this.onClickHandlerInjectCombobox);
    }
    $('#ut_tools_conceptmapper_map').append(newConcept);
    return this.logAction('concept_created');
  };
  ConceptMapper.prototype.onClickHandlerInjectTextarea = function (event) {
    var $p, textarea;
    if (this.mode === this.LINK_MODE) {
      return this.onClickEdgeHandler(event);
    } else if (!$(event.target).is('textarea')) {
      $p = $(event.target);
      textarea = $('<textarea/>').val($p.text());
      textarea.autogrow();
      $p.replaceWith(textarea);
      textarea.on('blur', this.onBlurHandlerInjectParagraph);
      return textarea.focus();
    }
  };
  ConceptMapper.prototype.onClickHandlerInjectCombobox = function (event) {
    var $p, inputField;
    if (this.mode === this.LINK_MODE) {
      return this.onClickEdgeHandler(event);
    } else if (!$(event.target).is('input')) {
      $p = $(event.target);
      inputField = $('<input/>').val($p.text());
      inputField.autocomplete({
        source: this.availableConcepts,
        minLength: 0
      });
      $p.replaceWith(inputField);
      inputField.blur(this.onBlurHandlerInjectParagraph);
      inputField.autocomplete('search', '');
      return inputField.focus();
    }
  };
  ConceptMapper.prototype.onClickHandlerConnectionLabel = function (label) {
    var inputField;
    if ($('#' + label.canvas.id).find('input').length) {
      return $('#' + label.canvas.id).find('input').autocomplete('search', '');
    } else {
      this.editingLabel = label;
      inputField = $('<input/>').val(this.editingLabel.getLabel());
      inputField.autocomplete({
        source: this.availableRelations,
        minLength: 0
      });
      $('#' + label.canvas.id).text('');
      inputField.addClass('_jsPlumb_overlay');
      inputField.css('text-align', 'left');
      inputField.css('font-size', 'medium');
      $('#' + label.canvas.id).append(inputField);
      inputField.blur(this.onBlurHandlerInjectRelation);
      inputField.autocomplete('search', '');
      inputField.focus();
      return jsPlumb.repaintEverything();
    }
  };
  ConceptMapper.prototype.onBlurHandlerInjectRelation = function (event) {
    this.editingLabel.setLabel(nl2br($(event.target).val()));
    $(this).parent().text(this.editingLabel.getLabel());
    $(this).remove();
    return jsPlumb.repaintEverything();
  };
  ConceptMapper.prototype.onBlurHandlerInjectParagraph = function (event) {
    var inputElement, p;
    inputElement = $(this);
    p = $('<p/>').html(nl2br(inputElement.val()));
    inputElement.replaceWith(p);
    return jsPlumb.repaintEverything();
  };
  ConceptMapper.prototype.removeConcept = function (concept) {
    var id;
    id = $(concept).attr('id');
    jsPlumb.select({ source: id }).detach();
    jsPlumb.select({ target: id }).detach();
    return $(concept).fadeOut(300, function () {
      return $(concept).remove();
    });
  };
  ConceptMapper.prototype.onClickHandlerTrashcan = function () {
    $('#ut_tools_conceptmapper_dialog').text('Do you really want to delete all concepts?');
    $('#ut_tools_conceptmapper_dialog').dialog({
      title: 'Remove concepts?',
      resizable: false,
      modal: true,
      autoOpen: false,
      position: {
        position: {
          my: 'center',
          at: 'center'
        },
        closeOnEscape: false,
        open: function (event, ui) {
        },
        beforeclose: function (event, ui) {
          return false;
        },
        dialogClass: 'ut_tools_conceptmapper_dialog',
        buttons: {
          Yes: function (this$) {
            return function () {
              this$.deleteAll();
              return $('#ut_tools_conceptmapper_dialog').dialog('close');
            };
          }(this),
          No: function () {
            return $('#ut_tools_conceptmapper_dialog').dialog('close');
          }
        }
      }
    });
    $('#ut_tools_conceptmapper_dialog').dialog('open');
    return $('.ui-dialog :button').blur();
  };
  ConceptMapper.prototype.deleteAll = function () {
    return $.each($('#ut_tools_conceptmapper_map .ut_tools_conceptmapper_concept'), function (this$) {
      return function (index, concept) {
        return this$.removeConcept(concept);
      };
    }(this));
  };
  ConceptMapper.prototype.setMode = function (newMode) {
    if (newMode === this.mode) {
      return;
    } else {
      switch (newMode) {
      case this.NODE_MODE:
        $('#ut_tools_conceptmapper_map').find('.ut_tools_conceptmapper_concept').draggable('enable');
        $('.ut_tools_conceptmapper_template').removeClass('ut_tools_conceptmapper_lowLight');
        $('#ut_tools_conceptmapper_linkButton').removeClass('pressedButton');
        $('#ut_tools_conceptmapper_linkButton').addClass('activeButton');
        this.mode = newMode;
        return this.activateJsPlumbEdgeMode(false);
      case this.LINK_MODE:
        $('#ut_tools_conceptmapper_map').find('.ut_tools_conceptmapper_concept').draggable('disable');
        $('.ut_tools_conceptmapper_template').addClass('ut_tools_conceptmapper_lowLight');
        $('#ut_tools_conceptmapper_map').find('.ut_tools_conceptmapper_concept').css('opacity', '1.0');
        $('#ut_tools_conceptmapper_linkButton').addClass('pressedButton');
        $('#ut_tools_conceptmapper_linkButton').removeClass('activeButton');
        this.activateJsPlumbEdgeMode(true);
        return this.mode = newMode;
      default:
        return console.log('setMode: unrecognized mode ' + newMode + ' doing nothing.');
      }
    }
  };
  ConceptMapper.prototype.onClickEdgeHandler = function (event) {
    var connection;
    if (this.sourceNode === void 0) {
      this.sourceNode = event.currentTarget;
      $(this.sourceNode).toggleClass('highlight_concept');
    } else if (event.currentTarget === this.sourceNode) {
      $(event.currentTarget).toggleClass('highlight_concept');
      this.sourceNode = void 0;
    } else {
      this.targetNode = event.currentTarget;
    }
    if (this.sourceNode !== void 0 && this.targetNode !== void 0) {
      if (this.connectionExists(this.sourceNode, this.targetNode)) {
        if (this.debug)
          console.log('Connection already exists -> delete.');
        this.deleteConnectionsBetween(this.sourceNode, this.targetNode);
      } else {
        if (this.debug)
          console.log('Connection does not exist -> create.');
        connection = jsPlumb.connect({
          source: this.sourceNode,
          target: this.targetNode
        });
        connection.getOverlay('label').setLabel('is a');
      }
      $(this.sourceNode).removeClass('highlight_concept');
      $(this.targetNode).removeClass('highlight_concept');
      this.sourceNode = void 0;
      this.targetNode = void 0;
      return jsPlumb.repaintEverything();
    }
  };
  ConceptMapper.prototype.activateJsPlumbEdgeMode = function (activate) {
    if (activate) {
      return $('#ut_tools_conceptmapper_map').find('.ut_tools_conceptmapper_concept').each(function (this$) {
        return function (index, concept) {
          jsPlumb.makeSource(concept, {});
          return jsPlumb.makeTarget(concept, {
            dropOptions: { hoverClass: 'jsPlumbHover' },
            beforeDrop: function (this$1) {
              return function (params) {
                if (params.sourceId === params.targetId) {
                  if (this$1.debug)
                    console.log('Creating edges between same source and target is disallowed.');
                  return false;
                } else if (this$1.connectionExists(params.sourceId, params.targetId)) {
                  if (this$1.debug)
                    console.log('An edge between concepts already exists -> delete it (instead of create a new one).');
                  this$1.deleteConnectionsBetween(params.sourceId, params.targetId);
                  return false;
                } else {
                  if (this$1.debug)
                    console.log('All conditions met, create a new edge.');
                  return true;
                }
              };
            }(this$)
          });
        };
      }(this));
    } else {
      jsPlumb.unmakeEverySource();
      return jsPlumb.unmakeEveryTarget();
    }
  };
  ConceptMapper.prototype.connectionExists = function (sourceId, targetId) {
    var existingConnections;
    existingConnections = jsPlumb.getConnections({
      source: sourceId,
      target: targetId
    });
    existingConnections = existingConnections.concat(jsPlumb.getConnections({
      source: targetId,
      target: sourceId
    }));
    return existingConnections.length > 0;
  };
  ConceptMapper.prototype.deleteConnectionsBetween = function (sourceId, targetId) {
    var connections;
    connections = jsPlumb.getConnections({
      source: sourceId,
      target: targetId
    });
    connections = connections.concat(jsPlumb.getConnections({
      source: targetId,
      target: sourceId
    }));
    return function (accum$) {
      var connection;
      for (var i$ = 0, length$ = connections.length; i$ < length$; ++i$) {
        connection = connections[i$];
        accum$.push(jsPlumb.detach(connection));
      }
      return accum$;
    }.call(this, []);
  };
  ConceptMapper.prototype.getConceptMapAsJSon = function () {
    var conceptMap, connection, edge, edges, meta, nodes;
    conceptMap = {};
    meta = {};
    meta.type = 'ut.tools.conceptmapper';
    meta.lab_name = 'unknown lab';
    meta.domain = 'unknown domain';
    conceptMap.meta = meta;
    nodes = [];
    $.each($('#ut_tools_conceptmapper_map .ut_tools_conceptmapper_concept'), function (index, concept) {
      var node;
      node = {};
      node.x = $(concept).offset().left;
      node.y = $(concept).offset().top;
      node.content = $(concept).find('p').text();
      node.id = $(concept).attr('id');
      if ($(concept).hasClass('ut_tools_conceptmapper_conceptSelector')) {
        node.type = 'ut_tools_conceptmapper_conceptSelector';
      } else {
        node.type = 'ut_tools_conceptmapper_conceptTextarea';
      }
      return nodes.push(node);
    });
    conceptMap.nodes = nodes;
    edges = [];
    for (var cache$ = jsPlumb.getConnections(), i$ = 0, length$ = cache$.length; i$ < length$; ++i$) {
      connection = cache$[i$];
      edge = {};
      edge.source = connection.sourceId;
      edge.target = connection.targetId;
      edge.label = connection.getOverlay('label').getLabel();
      edges.push(edge);
    }
    conceptMap.edges = edges;
    return conceptMap;
  };
  ConceptMapper.prototype.loadConceptMap = function () {
    return this.storage.getJSonObjectFromDialog(function (this$) {
      return function (errorMsg, jsonObject) {
        if (errorMsg) {
          return console.log('Error loading from file: ' + errorMsg + '.');
        } else if (jsonObject.meta.type === 'ut.tools.conceptmapper') {
          return this$.setConceptMapFromJSON(jsonObject);
        } else {
          return alert('Could not load file.\nIs it really a concept map file?');
        }
      };
    }(this));
  };
  ConceptMapper.prototype.setConceptMapFromJSON = function (conceptMap) {
    var connection, edge, node;
    this.deleteAll();
    for (var i$ = 0, length$ = conceptMap.nodes.length; i$ < length$; ++i$) {
      node = conceptMap.nodes[i$];
      this.createConcept(node.id, node.content, node.x, node.y, node.type);
    }
    for (var i$1 = 0, length$1 = conceptMap.edges.length; i$1 < length$1; ++i$1) {
      edge = conceptMap.edges[i$1];
      connection = jsPlumb.connect({
        source: edge.source,
        target: edge.target
      });
      connection.getOverlay('label').setLabel(edge.label);
    }
    return jsPlumb.repaintEverything();
  };
  return ConceptMapper;
}();

//# sourceMappingURL=ConceptMapper0.6.map
