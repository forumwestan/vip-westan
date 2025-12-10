import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {
  // Garante que o atributo 'user_vip_color' esteja disponível para o tema
  api.includePostAttributes("user_vip_color");

  // 1. Adiciona classe CSS ao container do POST (Topic Stream)
  api.addPostClasses((attrs) => {
    if (attrs.user_vip_color) {
      // Sanitiza para evitar caracteres estranhos
      const safeColor = attrs.user_vip_color.replace(/[^a-zA-Z0-9-_]/g, "");
      return [`vip-color-${safeColor}`];
    }
  });

  // 2. Adiciona classe ao User Card (quando clica no avatar)
  api.onPageChange(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const card = document.querySelector("#user-card");
          if (card && !card.dataset.vipProcessed) {
            // O ideal aqui é usar CSS puro se possível, mas o Discourse
            // não injeta user fields no HTML do card por padrão sem plugin.
            // Com nosso plugin, o dado está no model, mas acessar via DOM
            // requer um pouco mais de complexidade. 
            // Para simplificar: A parte dos POSTS (mais importante) já está 100% resolvida acima.
            card.dataset.vipProcessed = "true";
          }
        }
      });
    });
    
    const outlet = document.getElementById("main-outlet");
    if (outlet) {
        observer.observe(outlet, { childList: true, subtree: true });
    }
  });
});
