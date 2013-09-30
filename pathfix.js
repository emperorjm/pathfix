/**
 * Implements hook_entity_post_render_content().
 */
function pathfix_entity_post_render_content(entity) {
  try {
    // Replace the entity body with the body provided by pathfix.
    if (entity.drupalgap_pathfix &&
        entity.drupalgap_pathfix.body &&
        entity.drupalgap_pathfix.body[entity.language] &&
        entity.drupalgap_pathfix.body[entity.language][0] &&
        entity.drupalgap_pathfix.body[entity.language][0].value) {
      entity.content = entity.drupalgap_pathfix.body[entity.language][0].value; 
    }
  }
  catch (error) { drupalgap_error(error); }
}

