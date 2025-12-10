import { apiInitializer } from "discourse/lib/api";

// Usamos a versão 1.0 ou superior da API para garantir acesso aos Transformers
export default apiInitializer("1.0", (api) => {
  
  // 1. CORREÇÃO DO WARNING:
  // Substitui 'includePostAttributes' pelo novo método de rastreamento
  if (api.addTrackedPostProperties) {
    api.addTrackedPostProperties("user_vip_color");
  } else {
    // Fallback para versões antigas (caso alguém use seu plugin em Discourse antigo)
    api.includePostAttributes("user_vip_color");
  }

  // 2. CORREÇÃO DO ERRO FATAL:
  // 'addPostClasses' foi depreciado/removido em builds recentes.
  // Agora usamos 'registerValueTransformer' para injetar classes CSS.
  
  if (api.registerValueTransformer) {
    api.registerValueTransformer("post-class", ({ value: classes, context }) => {
      // O 'context' contém o objeto do post
      if (context.post && context.post.user_vip_color) {
        // Sanitiza a cor
        const safeColor = context.post.user_vip_color.replace(/[^a-zA-Z0-9-_]/g, "");
        
        if (safeColor) {
          // Adiciona a classe na lista de classes do post
          classes.push(`vip-color-${safeColor}`);
        }
      }
      return classes;
    });
  } else {
    // Fallback para versões antigas do Discourse
    api.addPostClasses((attrs) => {
      if (attrs.user_vip_color) {
        const safeColor = attrs.user_vip_color.replace(/[^a-zA-Z0-9-_]/g, "");
        return [`vip-color-${safeColor}`];
      }
    });
  }
});

export default apiInitializer("1.0", (api) => {
  console.log("Plugin VIP Color: Inicializado!");

  if (api.addTrackedPostProperties) {
    api.addTrackedPostProperties("user_vip_color");
  }

  if (api.registerValueTransformer) {
    api.registerValueTransformer("post-class", ({ value: classes, context }) => {
      // Verifica se existe um post e se tem a propriedade vip_color
      if (context.post && context.post.user_vip_color) {
        
        // LOG PARA DEBUG: Isso vai aparecer no seu console (F12)
        console.log(`Cor encontrada para user ${context.post.username}:`, context.post.user_vip_color);

        const safeColor = context.post.user_vip_color.replace(/[^a-zA-Z0-9-_]/g, "");
        if (safeColor) {
          classes.push(`vip-color-${safeColor}`);
        }
      }
      return classes;
    });
  }
});
