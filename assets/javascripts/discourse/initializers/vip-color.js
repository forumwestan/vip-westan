import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.0", (api) => {
  // Solicita o campo vindo do Ruby
  if (api.addTrackedPostProperties) {
    api.addTrackedPostProperties("user_vip_color");
  }

  // Injeta a classe CSS
  if (api.registerValueTransformer) {
    api.registerValueTransformer("post-class", ({ value: classes, context }) => {
      if (context.post && context.post.user_vip_color) {
        // Garante que seja string e minúsculo
        const colorName = context.post.user_vip_color.toString().toLowerCase();
        
        // Remove caracteres perigosos
        const safeColor = colorName.replace(/[^a-z0-9-_]/g, "");
        
        if (safeColor) {
          classes.push(`vip-color-${safeColor}`);
        }
      }
      return classes;
    });
  }
});
