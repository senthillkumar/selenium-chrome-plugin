
var sam =[];
chrome.storage.sync.set({ "info": sam }, function() {

});

  abc = function(element){
    var elements = new Array();
    
    if (element && element.hasChildNodes()) 
    {     
      elements.push(element);
      var childs = element.childNodes;

      for (var i = 0; i < childs.length; i++) 
      {
        if (childs[i].contentDocument || childs[i].contentWindow) 
        {
          var iframe = (childs[i].contentDocument || childs[i].contentWindow);
          if (iframe) {
            //iframes.push(childs[i]);
            elements.push(childs[i]);
            var innerchilds = iframe.childNodes;
          }
          if (innerchilds) {
            for (var j = 0; j < innerchilds.length; j++) {
              if (innerchilds[j].hasChildNodes()) {
                elements = elements.concat(abc(innerchilds[j]));
              }
              else if (innerchilds[j].nodeType == 1) {
                elements.push(innerchilds[j]);
              }
            }
          }
        }
        else if (childs[i].hasChildNodes()) {
          elements = elements.concat(abc(childs[i]));
        }
        else if (childs[i].nodeType == 1) {
          elements.push(childs[i]);
        }
      }
    }
    return elements;
  };

  eventListener = function(e){

    var rightclick;
    if(e.button){

      myelement = e.target;
      e.stopPropagation();
      action(e.target)

    }
   

  };


  try {
    var elements = abc(document.body);

  } catch (e){
    alert(e);
  }

  for (var i = 0; i < elements.length; i++) 
    {
      elements[i].addEventListener("mousedown", eventListener, false);
    }




  

function action (myelement) {
    // If the received message has the expected format...
    

    	var res;
    	chrome.storage.sync.get(["info"], function(result) {
    			
          var newArr = result.info.slice();
        
	        // Call the specified callback, passing
	        // the web-page's DOM content as argument
	        var name1 = prompt('what is the name of the element?');
          var abc;
         

	        try{
		          abc = getLocator(myelement);
    	    	}
    	    	catch (e){
    	    		alert(e.stack);
    	    	}

            var res =[];
            

            
            for(i =0;i< abc.length;i++){
              
                

                if(abc[i].startsWith('id=')>0){

                  

                  var locator1 = {
                    name : name1,
                    class : getClassName(myelement),
                    strict_locator : abc[i],
                    locator : {
                      id : abc[i].substring(abc[i].indexOf('id=')),
                      tag_name : myelement.tagName
                    },
                    frameName : getFrameName(myelement)
                  };
                  
                  res.push(locator1);
                  
                } else if(abc[i].startsWith('name=')>0){

                  var locator1 = {
                    name : name1,
                    class : getClassName(myelement),
                    strict_locator : abc[i],
                    locator : {
                      name : abc[i].substring(abc[i].indexOf('name=')),
                      tag_name : myelement.tagName
                    },
                    frameName : getFrameName(myelement)
                  };
                  

                  res.push(locator1);
                  

                } else if(abc[i].startsWith('link=')>0){

                  var locator1 = {
                    name : name1,
                    class : getClassName(myelement),
                    strict_locator : abc[i],
                    locator : {
                      link : abc[i].substring(abc[i].indexOf('link=')),
                      tag_name : myelement.tagName
                    },
                    frameName : getFrameName(myelement)
                  };
                  

                    res.push(locator1);

                } else if(abc[i].startsWith('css=')>0){

                  var locator1 = {
                    name : name1,
                    class : getClassName(myelement),
                    strict_locator : abc[i],
                    locator : {
                      css : abc[i].substring(abc[i].indexOf('css=')),
                      tag_name : myelement.tagName
                     },
                     frameName : getFrameName(myelement) 
                    };
                    
                    res.push(locator1);
                } else if(abc[i].startsWith('xpath=')>0){

                  var locator1 = {
                    name : name1,
                    class : getClassName(myelement),
                    strict_locator : abc[i],
                    locator : {
                      xpath : abc[i].substring(abc[i].indexOf('xpath=')),
                      tag_name : myelement.tagName
                      },
                      frameName : getFrameName(myelement)
                    };
                    

                } else if(abc[i].startsWith('//')>0){

                  var locator1 = {
                    name : name1,
                    class : getClassName(myelement),
                    strict_locator : abc[i],
                    locator : {
                      xpath : abc[i],
                      tag_name : myelement.tagName
                      },
                      frameName : getFrameName(myelement)
                    };
                    
                    res.push(locator1);
                }

                
              
            }
	        newArr.push({ "key":name1, "value":res});
	        
	        
	        chrome.storage.sync.set({"info": newArr }, function() {

			    });
		});
    
};
//TODO

function getFrameName(element){

  if (element.nodeName === '#document' && element.defaultView && element.defaultView.frameElement && element.defaultView.frameElement.id && element.defaultView.frameElement.tagName){
    //return element.defaultView.frameElement.id;
    if( element.defaultView.frameElement.parentNode === undefined || element.defaultView.frameElement.parentNode === null){
      return element.defaultView.frameElement.id;
    }else{
      var data = getFrameName(element.defaultView.frameElement.parentNode);
      if(data === ""){
        return element.defaultView.frameElement.id
      }else{
        return data+ " >>"+element.defaultView.frameElement.id;
      }
    }
  } else if( element.parentNode === undefined || element.parentNode === null){
      return "";
  } else {

    return getFrameName(element.parentNode);
  }
}

function getClassName(element){

  if( (element.tagName.toLowerCase() === 'button') 
    || (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='button' )
    || (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='image' )
    || (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='reset' )
    || (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='submit' )){

    return "Button";

  } else if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase() ==='checkbox'){
    return "CheckBox";
  } else if ( element.tagName.toLowerCase() === 'div'){
    return "Div";
  } else if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='file'){
    return "FileField";
  } else if (element.tagName.toLowerCase() === 'frame' || element.tagName.toLowerCase() === 'iframe'){
    return "Frame";
  } else if (element.tagName.toLowerCase() === 'h1'){
    return "H1";
  }else if (element.tagName.toLowerCase() === 'h2'){
    return "H2";
  }else if (element.tagName.toLowerCase() === 'h3'){
    return "H3";
  }else if (element.tagName.toLowerCase() === 'h4'){
    return "H4";
  }else if (element.tagName.toLowerCase() === 'h5'){
    return "H5";
  }else if (element.tagName.toLowerCase() === 'h6'){
    return "H6";
  } else if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='hidden') {
    return "Hidden";
  } else if (element.tagName.toLowerCase() === 'image'){
    return "Image";
  } else if (element.tagName.toLowerCase() === 'label'){
    return "Label";
  } else if (element.tagName.toLowerCase() === 'li'){
    return "LI";
  } else if (element.tagName.toLowerCase() === 'a'){
    return "A";
  } else if (element.tagName.toLowerCase() === 'p'){
    return "P";
  } else if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='radio'){
    return "Radio";
  } else if (element.tagName.toLowerCase() === 'select'){
    return "SelectList";
  } else if (element.tagName.toLowerCase() === 'span'){
    return "Span";
  } else if (element.tagName.toLowerCase() === 'table'){
    return "Table";
  } else if (element.tagName.toLowerCase() === 'td'){
    return "TD";
  } else if (element.tagName.toLowerCase() === 'tr'){
    return "Tr";
  } else if (element.tagName.toLowerCase() === 'textarea') {
    return "TextArea";
  } else if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='text') {
    return "TextField";
  } else if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type').toLowerCase()==='password') {
    return "TextField";
  }
}




function getLocator(node, angular, customAttribute) {
        var response = {};
        locator = new LocatorBuilders();

        return locator.buildAll(node);
       
}


function LocatorBuilders(){


}



LocatorBuilders.order = [];
LocatorBuilders.builderMap = {};


LocatorBuilders.add = function(name, finder) {
  this.order.push(name);
  this.builderMap[name] = finder;
};

LocatorBuilders.prototype.buildAll = function(el) {
    var result = [];

    for (var i = 0; i < LocatorBuilders.order.length; i++) {
        var finderName = LocatorBuilders.order[i];
        try {
          locator = this.buildWith(finderName, el);
          
          if(locator){
            console.log(locator);
            result.push(locator);
          }
        }catch(e){

        }
    }
    return result;
};



/*
 * Utility function: Encode XPath attribute value.
 */
LocatorBuilders.prototype.attributeValue = function(value) {
  if (value.indexOf("'") < 0) {
    return "'" + value + "'";
  } else if (value.indexOf('"') < 0) {
    return '"' + value + '"';
  } else {
    var result = 'concat(';
    var part = "";
    while (true) {
      var apos = value.indexOf("'");
      var quot = value.indexOf('"');
      if (apos < 0) {
        result += "'" + value + "'";
        break;
      } else if (quot < 0) {
        result += '"' + value + '"';
        break;
      } else if (quot < apos) {
        part = value.substring(0, apos);
        result += "'" + part + "'";
        value = value.substring(part.length);
      } else {
        part = value.substring(0, quot);
        result += '"' + part + '"';
        value = value.substring(part.length);
      }
      result += ',';
    }
    result += ')';
    return result;
  }
};

LocatorBuilders.prototype.xpathHtmlElement = function(name) {
  if ( document.contentType == 'application/xhtml+xml') {
    // "x:" prefix is required when testing XHTML pages
    return "x:" + name;
  } else {
    return name;
  }
};

LocatorBuilders.prototype.relativeXPathFromParent = function(current) {
  var index = this.getNodeNbr(current);
  var currentPath = '/' + this.xpathHtmlElement(current.nodeName.toLowerCase());
  if (index > 0) {
    currentPath += '[' + (index + 1) + ']';
  }
  return currentPath;
};

LocatorBuilders.prototype.getNodeNbr = function(current) {
  var childNodes = current.parentNode.childNodes;
  var total = 0;
  var index = -1;
  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];
    if (child.nodeName == current.nodeName) {
      if (child == current) {
        index = total;
      }
      total++;
    }
  }
  return index;
};


LocatorBuilders.prototype.buildWith = function(name, e, opt_contextNode) {
  return LocatorBuilders.builderMap[name].call(this, e, opt_contextNode);
};

LocatorBuilders.add('id', function(e) {
  if (e.id) {
    return 'id=' + e.id;
  }
  return null;
});


LocatorBuilders.prototype.getNodeNbr = function(current) {
  var childNodes = current.parentNode.childNodes;
  var total = 0;
  var index = -1;
  for (var i = 0; i < childNodes.length; i++) {
    var child = childNodes[i];
    if (child.nodeName == current.nodeName) {
      if (child == current) {
        index = total;
      }
      total++;
    }
  }
  return index;
};

LocatorBuilders.prototype.getCSSSubPath = function(e) {
  var css_attributes = ['id', 'name', 'class', 'type', 'alt', 'title', 'value'];
  for (var i = 0; i < css_attributes.length; i++) {
    var attr = css_attributes[i];
    var value = e.getAttribute(attr);
    if (value) {
      if (attr == 'id')
        return '#' + value;
      if (attr == 'class')
        return e.nodeName.toLowerCase() + '.' + value.replace(" ", ".").replace("..", ".");
      return e.nodeName.toLowerCase() + '[' + attr + '="' + value + '"]';
    }
  }
  if (this.getNodeNbr(e))
    return e.nodeName.toLowerCase() + ':nth-of-type(' + this.getNodeNbr(e) + ')';
  else
    return e.nodeName.toLowerCase();
};

LocatorBuilders.prototype.preciseXPath = function(xpath, e){
  //only create more precise xpath if needed
  if (this.findElement(xpath) != e) {
    var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //skip first element (result:0 xpath index:1)
    for (var i=0, len=result.snapshotLength; i < len; i++) {
      var newPath = 'xpath=(' +  xpath + ')[' + (i +1 )+']';
      if ( this.findElement(newPath) == e ) {
          return newPath ;
      }
    }
  }
  return xpath;
};


LocatorBuilders.prototype.findElement = function (xpath){


  var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  if(result.snapshotLength == 1 ){
    return result.snapshotItem(0);
  }
  
  return null;

};


LocatorBuilders.add('link', function(e) {
  if (e.nodeName == 'A') {
    var text = e.textContent;
    if (!text.match(/^\s*$/)) {
      return "link=" + exactMatchPattern(text.replace(/\xA0/g, " ").replace(/^\s*(.*?)\s*$/, "$1"));
    }
  }
  return null;
});

LocatorBuilders.add('name', function(e) {
  if (e.name) {
    return 'name=' + e.name;
  }
  return null;
});

LocatorBuilders.add('css', function(e) {
  var current = e;
  var sub_path = this.getCSSSubPath(e);
  while (document.querySelector(sub_path) != e && current.nodeName.toLowerCase() != 'html') {
    sub_path = this.getCSSSubPath(current.parentNode) + ' > ' + sub_path;
    current = current.parentNode;
  }
  return "css=" + sub_path;
});


LocatorBuilders.add('xpath:link', function(e) {
  if (e.nodeName == 'A') {
    var text = e.textContent;
    if (!text.match(/^\s*$/)) {
      return this.preciseXPath("//" + this.xpathHtmlElement("a") + "[contains(text(),'" + text.replace(/^\s+/, '').replace(/\s+$/, '') + "')]", e);
    }
  }
  return null;
});

LocatorBuilders.add('xpath:img', function(e) {
  if (e.nodeName == 'IMG') {
    if (e.alt != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[@alt=" + this.attributeValue(e.alt) + "]", e);
    } else if (e.title != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[@title=" + this.attributeValue(e.title) + "]", e);
    } else if (e.src != '') {
      return this.preciseXPath("//" + this.xpathHtmlElement("img") + "[contains(@src," + this.attributeValue(e.src) + ")]", e);
    }
  }
  return null;
});

LocatorBuilders.add('xpath:attributes', function(e) {
  PREFERRED_ATTRIBUTES = ['id', 'name', 'value', 'type', 'action', 'onclick'];
  var i = 0;

  function attributesXPath(name, attNames, attributes) {
    var locator = "//" + this.xpathHtmlElement(name) + "[";
    for (i = 0; i < attNames.length; i++) {
      if (i > 0) {
        locator += " and ";
      }
      var attName = attNames[i];
      locator += '@' + attName + "=" + this.attributeValue(attributes[attName]);
    }
    locator += "]";
    return this.preciseXPath(locator, e);
  }

  if (e.attributes) {
    var atts = e.attributes;
    var attsMap = {};
    for (i = 0; i < atts.length; i++) {
      var att = atts[i];
      attsMap[att.name] = att.value;
    }
    var names = [];
    // try preferred attributes
    for (i = 0; i < PREFERRED_ATTRIBUTES.length; i++) {
      var name = PREFERRED_ATTRIBUTES[i];
      if (attsMap[name] != null) {
        names.push(name);
        var locator = attributesXPath.call(this, e.nodeName.toLowerCase(), names, attsMap);
        if (e == this.findElement(locator)) {
          return locator;
        }
      }
    }
  }
  return null;
});

LocatorBuilders.add('xpath:idRelative', function(e) {
  var path = '';
  var current = e;
  while (current != null) {
    if (current.parentNode != null) {
      path = this.relativeXPathFromParent(current) + path;
      if (1 == current.parentNode.nodeType && // ELEMENT_NODE
          current.parentNode.getAttribute("id")) {
        return this.preciseXPath("//" + this.xpathHtmlElement(current.parentNode.nodeName.toLowerCase()) +
            "[@id=" + this.attributeValue(current.parentNode.getAttribute('id')) + "]" +
            path, e);
      }
    } else {
      return null;
    }
    current = current.parentNode;
  }
  return null;
});

LocatorBuilders.add('xpath:href', function(e) {
  if (e.attributes && e.hasAttribute("href")) {
    href = e.getAttribute("href");
    if (href.search(/^http?:\/\//) >= 0) {
      return this.preciseXPath("//" + this.xpathHtmlElement("a") + "[@href=" + this.attributeValue(href) + "]", e);
    } else {
      // use contains(), because in IE getAttribute("href") will return absolute path
      return this.preciseXPath("//" + this.xpathHtmlElement("a") + "[contains(@href, " + this.attributeValue(href) + ")]",e);
    }
  }
  return null;
});

LocatorBuilders.add('dom:index', function(e) {
  if (e.form) {
    var formLocator = this.findDomFormLocator(e.form);
    if (formLocator) {
      var elements = e.form.elements;
      for (var i = 0; i < elements.length; i++) {
        if (elements[i] == e) {
          return formLocator + ".elements[" + i + "]";
        }
      }
    }
  }
  return null;
});

LocatorBuilders.add('xpath:position', function(e, opt_contextNode) {
  this.log.debug("positionXPath: e=" + e);
  var path = '';
  var current = e;
  while (current != null && current != opt_contextNode) {
    var currentPath;
    if (current.parentNode != null) {
      currentPath = this.relativeXPathFromParent(current);
    } else {
      currentPath = '/' + this.xpathHtmlElement(current.nodeName.toLowerCase());
    }
    path = currentPath + path;
    var locator = '/' + path;
    if (e == this.findElement(locator)) {
      return locator;
    }
    current = current.parentNode;
    this.log.debug("positionXPath: current=" + current);
  }
  return null;
});




