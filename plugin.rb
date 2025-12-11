# name: vip-westan
# about: Adiciona cor ao nick apenas se o usuario for do grupo VIP e tiver o campo preenchido
# version: 2.1
# authors: Westan

enabled_site_setting :vip_color_enabled

after_initialize do
  # ID do campo de usuario (Confirme se é 6 no seu painel)
  def get_field_id
    SiteSetting.vip_color_field_id.to_s
  end

  # Nome exato do grupo (slug) - Geralmente é minusculo
  def get_vip_group_name
    "vip" 
  end

  get_vip_data = Proc.new do |user|
    next nil unless user

    # VERIFICAÇÃO DE SEGURANÇA:
    # O usuário PRECISA estar no grupo 'vip' para a cor funcionar.
    is_vip = user.groups.any? { |g| g.name == get_vip_group_name }
    
    if is_vip && user.user_fields
      color = user.user_fields[get_field_id]
      # Retorna a cor em minusculo (ex: "Red" vira "red")
      color.present? ? color.downcase : nil
    else
      nil
    end
  end

  add_to_serializer(:post, :user_vip_color) { get_vip_data.call(object.user) }
  add_to_serializer(:user_card, :user_vip_color) { get_vip_data.call(object) }
end
