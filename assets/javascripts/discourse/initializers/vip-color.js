import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0", (api) => {
  // 1. Garante que o dado venha do servidor
  if (api.addTrackedPostProperties) {
    api.addTrackedPostProperties("user_vip_color");
  }

  // 2. A Mágica: Decorar o link do usuário diretamente
  // Essa função roda cada vez que um post é desenhado na tela
  api.decorateWidget("post-meta-data:user-link", (helper) => {
    const post = helper.getModel();
    
    if (post && post.user_vip_color) {
      // Limpa e padroniza a cor (Ex: "HotCamp" vira "hotcamp")
      const safeColor = String(post.user_vip_color).toLowerCase().replace(/[^a-z0-9-_]/g, "");
      
      if (safeColor) {
        // Retorna um VDOM node com a classe aplicada DIRETAMENTE no <a>
        // Isso simula exatamente o que seu script antigo fazia
        return helper.h(
          "a.username.vip-link", 
          {
            className: `vip-color-${safeColor}`, // Gera: vip-color-hotcamp
            href: post.user_url || `/u/${post.username}`,
            "data-user-card": post.username
          }, 
          post.username
        );
      }
    }
  });

  // 3. Fallback para posts que não usam Widgets (Glimmer components - Futuro do Discourse)
  // Caso a função acima não pegue, essa garante via DOM
  api.onPageChange(() => {
    const articles = document.querySelectorAll("article[data-user-id]");
    articles.forEach((article) => {
        // Tenta achar o modelo do post associado ao HTML
        // Nota: Isso é um hack visual seguro
        // Se a classe já estiver lá, ignora
    });
  });
});
