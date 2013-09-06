/**
 * Implements hook_entity_post_render_content().
 */
function pathfix_entity_post_render_content(entity) {
  try {
    
    // Replace relative image paths with an absolute path to the Drupal site.
    var regex = /(<img.*src=['"])(\/)/g;
    var replacement = "$1" + drupalgap.settings.site_path + "$2";
    entity.content = entity.content.replace(regex, replacement);
    
    // Replace internal links with drupalgap_goto() calls.
    // kodos syntax backup: href=['"]/*([-A-Za-z0-9+&@#\/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#\/%=~_()|])['"]
    regex = /href=['"]\/*([-A-Za-z0-9+&@#\/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#\/%=~_()|])['"]/g;
    var matches = entity.content.match(regex);
    if (matches && matches.length) {
      $.each(matches, function(index, match){
          console.log(match);
          // Determine the start position path within the match
          var start = 6;
          if (match.indexOf('/') == 6) { start = 7; }
          replacement = 'href="" onclick="javasciprt:drupalgap_goto(\'' + match.substring(start, match.length-1) + '\');"';
          entity.content = entity.content.replace(match, replacement);
      });
    }
    
    // Replace external links with an InAppBrowser link.
    // credit: http://www.codinghorror.com/blog/2008/10/the-problem-with-urls.html
    // kodos syntax backup: href=["']\(?\bhttp://[-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|]['"]
    regex = /href=["']\(?\bhttp:\/\/[-A-Za-z0-9+&@#\/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#\/%=~_()|]['"]/g;
    matches = entity.content.match(regex);
    if (matches && matches.length) {
      $.each(matches, function(index, match){
          // TODO - this needs to be tested!
          //if (s.StartsWith("(") && s.EndsWith(")")) {
            //return s.Substring(1, s.Length - 2);
          //}
          var url = match.substring(6, match.length-1);
          replacement = 'href="#" onclick="javascript:window.open(\'' + url + '\', \'_blank\', \'location=yes\');"';
          entity.content = entity.content.replace(match, replacement);
      });
    }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implements hook_404().
 */
function pathfix_404(router_path) {
  var path = false;
  // Is there an alias for this router_path available on the Drupal site?
  drupalgap.services.drupalgap_pathfix.url_alias.call({
      alias:router_path,
      async:false,
      success:function(data) {
        if (data && data[0]) {
          path = data[0];
        }
      }
  });
  return path;
}

/**
 * DrupalGap Pathfix Services.
 */
drupalgap.services.drupalgap_pathfix = {
  url_alias:{
    options:{
      type:'post',
      path:'drupalgap_pathfix/url_alias.json',
    },
    'call':function(options){
      try {
        if (typeof options.alias !== 'undefined') {
          var api_options = drupalgap_chain_callbacks(drupalgap.services.drupalgap_pathfix.url_alias.options, options);
          api_options.data = 'alias=' + options.alias;
          drupalgap.api.call(api_options);
        }
        else { drupalgap_error("missing 'alias' option!"); }
      }
      catch (error) {
        navigator.notification.alert(
          error,
          function(){},
          'DrupalGap Pathfix Error',
          'OK'
        );
      }
    }
  }
};

