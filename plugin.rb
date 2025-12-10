# name: discourse-vip-color
# about: Adiciona classe CSS de cor baseada em User Field para VIPs
# version: 1.1
# authors: Gemini
# url: https://github.com/SEU-USUARIO/discourse-vip-color
# required_version: 2.7.0

enabled_site_setting :vip_color_enabled

after_initialize do
  # Função segura para extrair a cor
  # O Discourse armazena user_fields como um Hash onde as chaves são Strings
  get_vip_color = Proc.new do |user|
    if user && user.user_fields
      field_id = SiteSetting.vip_color_field_id.to_s
      color = user.user_fields[field_id]
      # Retorna a cor apenas se não for nula e não estiver em branco
      color.present? ? color : nil
    else
      nil
    end
  end

  # Adiciona a cor ao serializador do POST (para aparecer nos tópicos)
  add_to_serializer(:post, :user_vip_color) do
    # object.user pode ser nil se o usuário foi deletado
    get_vip_color.call(object.user)
  end

  # Adiciona a cor ao serializador do UserCard (clique no avatar)
  add_to_serializer(:user_card, :user_vip_color) do
    get_vip_color.call(object)
  end
end
