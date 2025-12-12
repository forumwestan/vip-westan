# name: vip-westan
# about: Adiciona cor ao nick apenas se o usuario for do grupo VIP e tiver o campo preenchido
# version: 2.2
# authors: Westan
# url: https://github.com/SEU-USUARIO/vip-westan

enabled_site_setting :vip_color_enabled

after_initialize do
  # Lógica principal encapsulada em uma Proc para reutilização
  get_vip_data = Proc.new do |user|
    # 1. Se o usuário não existir (ex: deletado), para aqui
    next nil unless user

    # 2. Definições (Pega das configurações a cada chamada para garantir atualização)
    field_id = SiteSetting.vip_color_field_id.to_s
    vip_group_name = "vip"

    # 3. Verifica se o usuário pertence ao grupo VIP
    # Usamos .include? que é ligeiramente mais rápido que .any? para nomes de grupo
    is_vip = user.groups.any? { |g| g.name == vip_group_name }

    # 4. Se for VIP e tiver campos personalizados
    if is_vip && user.user_fields
      color = user.user_fields[field_id]
      
      # Retorna a cor em minúsculo e sem espaços extras
      if color.present?
        color.to_s.strip.downcase
      else
        nil
      end
    else
      nil
    end
  end

  # Adiciona ao Serializer do Post (Para aparecer nos tópicos)
  add_to_serializer(:post, :user_vip_color) do
    get_vip_data.call(object.user)
  end

  # Adiciona ao Serializer do UserCard (Para aparecer ao clicar no avatar)
  add_to_serializer(:user_card, :user_vip_color) do
    get_vip_data.call(object)
  end
  
  # Adiciona ao Serializer do Perfil (Para aparecer na página de perfil)
  add_to_serializer(:user, :user_vip_color) do
    get_vip_data.call(object)
  end
end
