// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  var _base, _base1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.ut || (window.ut = {});

  (_base = window.ut).commons || (_base.commons = {});

  (_base1 = window.ut.commons).metadata || (_base1.metadata = {});

  window.ut.commons.metadata.MetadataUtils = (function() {
    MetadataUtils.metadata = void 0;

    MetadataUtils.callback = void 0;

    MetadataUtils.jsonURL = void 0;

    function MetadataUtils(jsonURL, callback) {
      this.setDefaultLabMetadata = __bind(this.setDefaultLabMetadata, this);
      this.readLabMetaData = __bind(this.readLabMetaData, this);
      this.returnMetadataToCaller = __bind(this.returnMetadataToCaller, this);
      console.log("Initializing ut.commons.metadata.MetadataUtils.");
      this.callback = callback;
      this.jsonURL = jsonURL;
      $.ajax({
        url: this.jsonURL,
        dataType: "json",
        success: this.readLabMetaData,
        error: this.setDefaultLabMetadata,
        complete: this.returnMetadataToCaller
      });
    }

    MetadataUtils.prototype.returnMetadataToCaller = function() {
      return this.callback(this.metadata);
    };

    MetadataUtils.prototype.readLabMetaData = function(labMetadata) {
      console.log("reading lab metadata from " + this.jsonURL + ".");
      return this.metadata = labMetadata;
    };

    MetadataUtils.prototype.setDefaultLabMetadata = function() {
      console.log("reading lab metadata from " + this.jsonURL + " failed, falling back to default metadata.");
      return this.metadata = {
        "lab_name": "default lab name",
        "domain": "default domain",
        "topic": "default topic",
        "input_variables": [
          {
            "name": "length",
            "symbol": "L",
            "unit": "m",
            "type": "double",
            "values": "0.01 - 10.0"
          }, {
            "name": "mass",
            "symbol": "M",
            "unit": "kg",
            "type": "double",
            "values": "0.01 - 10.0"
          }, {
            "name": "time",
            "symbol": "T",
            "unit": "s",
            "type": "double",
            "values": "0.0 - 255.0"
          }, {
            "name": "electric current",
            "symbol": "I",
            "unit": "A",
            "type": "double",
            "values": "0.0 - 1000.0"
          }, {
            "name": "object density",
            "symbol": "ρ",
            "unit": "m/V",
            "type": "double",
            "values": "0.0 - 1000.0"
          }, {
            "name": "fluid density",
            "symbol": "ρ",
            "unit": "m/V",
            "type": "double",
            "values": "0.0 - 1000.0"
          }, {
            "name": "object",
            "symbol": "",
            "unit": "",
            "type": "",
            "values": ""
          }
        ],
        "output_variables": [
          {
            "name": "force",
            "symbol": "N",
            "unit": "kg*m*s^-2",
            "type": "double",
            "values": "0.0 - 1000.0"
          }, {
            "name": "voltage",
            "symbol": "V",
            "unit": "kg*m^1*s^-3*A^-1",
            "type": "double",
            "values": "0.0 - 1000.0"
          }, {
            "name": "energy",
            "symbol": "J",
            "unit": "kg*m^2*s-2",
            "type": "double",
            "values": "0.0 - 1000.0"
          }
        ],
        "relations": [
          {
            "speed": "speed = length / time"
          }, {
            "watt": "watt = energy / time"
          }
        ]
      };
    };

    return MetadataUtils;

  })();

}).call(this);

/*
//@ sourceMappingURL=MetadataUtils.map
*/
