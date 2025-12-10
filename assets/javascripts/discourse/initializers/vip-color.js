import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0", (api) => {
  // 1. Garante que o Discourse "enxergue" o campo user_vip_color no post
  if (api.addTrackedPostProperties) {
    api.addTrackedPostProperties("user_vip_color");
  }

  // 2. Registra o transformador de classe (Maneira moderna 2025)
  if (api.registerValueTransformer) {
    api.registerValueTransformer("post-class", ({ value: classes, context }) => {
      // Verifica se o contexto tem post e se o post tem a cor
      if (context.post && context.post.user_vip_color) {
        // Remove caracteres perigosos, deixando apenas letras, numeros e hifens
        const safeColor = context.post.user_vip_color.replace(/[^a-zA-Z0-9-_]/g, "");
        
        if (safeColor) {
          // Adiciona a classe no array de classes do post
          classes.push("vip-color-" + safeColor);
        }
      }
      // Retorna a lista de classes
      return classes;
    });
  }
});
