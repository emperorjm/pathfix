/**
 * Implements hook_entity_post_render_content().
 */
function pathauto_entity_post_render_content(entity) {
  try {
    var regex = /(<img.*src=['"])(\/)/g;
    var replacement = "$1" + drupalgap.settings.site_path + "$2";
    entity.content = entity.content.replace(regex, replacement);
  }
  catch (error) { drupalgap_error(error); }
}

