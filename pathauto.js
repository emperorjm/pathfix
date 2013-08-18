/**
 * Implements hook_entity_post_render_content().
 */
function pathauto_entity_post_render_content(entity) {
  try {
    
    // Replace relative image paths with an absolute path to the Drupal site.
    var regex = /(<img.*src=['"])(\/)/g;
    var replacement = "$1" + drupalgap.settings.site_path + "$2";
    entity.content = entity.content.replace(regex, replacement);
    
    // Replace external links with an InAppBrowser link.
    // credit: http://www.codinghorror.com/blog/2008/10/the-problem-with-urls.html
    // kodos syntax backup: href=["']\(?\bhttp://[-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|]['"]
    regex = /href=["']\(?\bhttp:\/\/[-A-Za-z0-9+&@#\/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#\/%=~_()|]['"]/g;
    var matches = entity.content.match(regex);
    if (matches && matches.length) {
      $.each(matches, function(index, match){
          var url = match.substring(6, match.length-1);
          replacement = 'onclick="javascript:window.open(\'' + url + '\', \'_blank\', \'location=yes\');"';
          entity.content = entity.content.replace(match, replacement);
      });
    }
  }
  catch (error) { drupalgap_error(error); }
}

