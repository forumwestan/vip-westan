# name: discourse-vip-color
# about: Adiciona a cor personalizada (User Field) como classe CSS nos posts
# version: 0.1
# authors: SeuNome
# url: https://github.com/SEU-USUARIO/discourse-vip-color

enabled_site_setting :vip_color_enabled

after_initialize do
  # Pega o ID do campo definido nas configurações (padrão 6)
  def get_color_field_id
    SiteSetting.vip_color_field_id
  end

  # Lógica para extrair a cor
  get_vip_color = Proc.new do |user|
    if user&.user_fields
      field_id = get_color_field_id.to_s
      color = user.user_fields[field_id]
      # Retorna a cor apenas se existir e não for vazia
      color.present? ? color : nil
    else
      nil
    end
  end

  # 1. Envia a cor junto com os dados do POST
  add_to_serializer(:post, :user_vip_color) do
    # Tenta pegar do objeto user carregado no post
    user = object.user
    get_vip_color.call(user) if user
  end

  # 2. Envia a cor junto com o User Card (clique no avatar)
  add_to_serializer(:user_card, :user_vip_color) do
    get_vip_color.call(object)
  end
  
  # 3. Envia a cor no perfil do usuário
  add_to_serializer(:user, :user_vip_color) do
    get_vip_color.call(object)
  end
end
