# name: discourse-vip-color
# about: Adiciona cor ao nick apenas se o usuario for do grupo VIP e tiver o campo preenchido
# version: 2.0
# authors: Westan
# url: https://github.com/forumwestan/vip-color

enabled_site_setting :vip_color_enabled

after_initialize do
  # CONFIGURAÇÃO: ID do campo e Nome do Grupo
  def get_field_id
    SiteSetting.vip_color_field_id.to_s
  end

  def get_vip_group_name
    "vip" # Nome exato do grupo (slug)
  end

  # Lógica principal
  get_vip_data = Proc.new do |user|
    # 1. Verifica se o usuário existe
    next nil unless user

    # 2. Verifica se o usuário pertence ao grupo VIP
    # Isso evita que ex-vips continuem com a cor
    is_vip = user.groups.any? { |g| g.name == get_vip_group_name }
    
    if is_vip && user.user_fields
      color = user.user_fields[get_field_id]
      
      # 3. Retorna a cor em MINÚSCULO (Downcase) para facilitar o CSS
      # Ex: "Red" vira "red", "Areia" vira "areia"
      color.present? ? color.downcase : nil
    else
      nil
    end
  end

  # Envia o dado para o Post (Tópicos)
  add_to_serializer(:post, :user_vip_color) do
    get_vip_data.call(object.user)
  end

  # Envia o dado para o User Card (Avatar clicado)
  add_to_serializer(:user_card, :user_vip_color) do
    get_vip_data.call(object)
  end
end
