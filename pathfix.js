/**
 * Implements hook_entity_post_render_field().
 */
function pathfix_entity_post_render_field(entity, field_name, field, reference) {
  try {
    // Replace the entity body with the body provided by pathfix.
    if (field_name == 'body') {
      if (entity.drupalgap_pathfix &&
          entity.drupalgap_pathfix.body &&
          entity.drupalgap_pathfix.body[entity.language] &&
          entity.drupalgap_pathfix.body[entity.language][0] &&
          entity.drupalgap_pathfix.body[entity.language][0].value) {
        reference.content = entity.drupalgap_pathfix.body[entity.language][0].value; 
      }
    }
  }
  catch (error) { drupalgap_error(error); }
}

