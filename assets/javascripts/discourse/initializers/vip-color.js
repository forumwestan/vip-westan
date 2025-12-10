import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11", (api) => {
  // 1. Solicita que o atributo 'user_vip_color' venha no JSON do post
  api.includePostAttributes("user_vip_color");

  // 2. A maneira OFICIAL de adicionar classes CSS a um post
  // Isso roda nativamente no ciclo de renderização do Discourse (Virtual DOM)
  api.addPostClasses((attrs) => {
    if (attrs.user_vip_color) {
      // Segurança: remove qualquer caractere que não seja letra/número/hífen
      const safeColor = attrs.user_vip_color.replace(/[^a-zA-Z0-9-_]/g, "");
      
      if (safeColor) {
        return [`vip-color-${safeColor}`];
      }
    }
  });
});
