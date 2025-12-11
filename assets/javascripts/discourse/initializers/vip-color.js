import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0", (api) => {
  // 1. Garante que o Discourse traga o dado "user_vip_color" do banco de dados
  if (api.addTrackedPostProperties) {
    api.addTrackedPostProperties("user_vip_color");
  }

  // 2. Decora o Post (Método Seguro e Direto)
  // 'element' é o HTML do post. 'helper' nos dá os dados do post (como a cor).
  api.decoratePost((element, helper) => {
    // Pega os dados do post
    const post = helper.getModel();

    // Se o post tiver a cor VIP definida...
    if (post && post.user_vip_color) {
      
      // Limpa a cor (ex: "BlueGray" vira "bluegray")
      const safeColor = String(post.user_vip_color).toLowerCase().trim().replace(/[^a-z0-9-_]/g, "");

      if (safeColor) {
        // PROCURA O LINK DO NOME DENTRO DESTE POST
        // Estamos mirando exatamente no <a> que você me mostrou no HTML
        const usernameLink = element.querySelector(".names .username a");

        if (usernameLink) {
          // Adiciona a classe DIRETO no link
          usernameLink.classList.add(`vip-color-${safeColor}`);
          
          // (Opcional) Adiciona uma classe extra para garantir que o CSS pegue
          usernameLink.classList.add("vip-link-active");
        }
      }
    }
  });
});
