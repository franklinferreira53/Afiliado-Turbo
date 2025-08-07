-- Seed data for development

-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (name, email, password, settings, created_at) VALUES 
('Admin User', 'admin@afiliadoturbo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5KZgN8pQ/2', '{}', NOW()),
('Demo User', 'demo@afiliadoturbo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5KZgN8pQ/2', '{"voice_preference": "female", "content_frequency": 3, "preferred_platforms": ["instagram", "facebook"], "categories": ["electronics", "home"]}', NOW());

-- Insert sample products
INSERT INTO products (title, description, price, original_price, image_url, product_url, affiliate_link, source, category, rating, reviews_count, popularity_score, created_at) VALUES 
('Smartphone Samsung Galaxy A54 128GB', 'Smartphone com excelente custo-benefício, câmera tripla e bateria de longa duração', 1299.99, 1599.99, 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Galaxy+A54', 'https://shopee.com.br/product/1', 'https://shopee.com.br/product/1?affiliate=demo', 'shopee', 'electronics', 4.5, 2847, 95, NOW()),
('Fones de Ouvido Bluetooth JBL Tune 510BT', 'Fones sem fio com qualidade de som JBL e 40 horas de bateria', 189.90, 299.99, 'https://via.placeholder.com/300x300/374151/ffffff?text=JBL+Tune', 'https://amazon.com.br/product/2', 'https://amazon.com.br/product/2?tag=affiliate', 'amazon', 'electronics', 4.3, 1256, 88, NOW()),
('Smartwatch Amazfit GTR 4', 'Smartwatch com GPS, monitor cardíaco e 14 dias de bateria', 699.99, 899.99, 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Amazfit', 'https://shopee.com.br/product/3', 'https://shopee.com.br/product/3?affiliate=demo', 'shopee', 'electronics', 4.7, 892, 92, NOW()),
('Carregador Wireless 15W', 'Carregador sem fio rápido compatível com todos smartphones', 79.90, 129.99, 'https://via.placeholder.com/300x300/9ca3af/ffffff?text=Wireless', 'https://amazon.com.br/product/4', 'https://amazon.com.br/product/4?tag=affiliate', 'amazon', 'electronics', 4.2, 543, 78, NOW()),
('Caixa de Som Bluetooth Portátil', 'Som potente com grave profundo e bateria de 12 horas', 149.99, 199.99, 'https://via.placeholder.com/300x300/ef4444/ffffff?text=Speaker', 'https://shopee.com.br/product/5', 'https://shopee.com.br/product/5?affiliate=demo', 'shopee', 'electronics', 4.4, 324, 85, NOW());

-- Insert sample content for demo user (user_id = 2)
INSERT INTO content (user_id, product_id, type, title, description, hashtags, cta_text, ai_generated_data, status, created_at) VALUES 
(2, 1, 'social_post', 'Post para Samsung Galaxy A54', 'Post otimizado para redes sociais', '["#smartphone", "#samsung", "#galaxy", "#tecnologia", "#oferta"]', '🔥 Garante o seu agora! Link na bio', '{"description": "🔥 Oferta imperdível! Samsung Galaxy A54 com 37% de desconto! Câmera tripla profissional, bateria que dura o dia todo e performance que surpreende. Não perca!", "hashtags": ["#smartphone", "#samsung", "#galaxy", "#tecnologia", "#oferta"], "cta": "🔥 Garante o seu agora! Link na bio", "fullPost": "🔥 Oferta imperdível! Samsung Galaxy A54 com 37% de desconto! Câmera tripla profissional, bateria que dura o dia todo e performance que surpreende. Não perca!\n\n🔥 Garante o seu agora! Link na bio\n\n#smartphone #samsung #galaxy #tecnologia #oferta"}', 'published', NOW() - INTERVAL '2 days'),
(2, 2, 'image', 'Imagem futurista para JBL', 'Imagem com fundo tecnológico', '[]', NULL, '{"image_url": "/uploads/jbl_generated.png", "seed": 12345}', 'approved', NOW() - INTERVAL '1 day'),
(2, 3, 'video_script', 'Script para Smartwatch', 'Script de 30 segundos', '[]', NULL, '{"script": "[Cena 1] Você já perdeu uma ligação importante por estar com o celular longe? [Cena 2] Com o Amazfit GTR 4, você recebe todas as notificações no pulso! [Cena 3] GPS integrado, 14 dias de bateria e monitoramento completo da saúde. [CTA] Não fique por fora - garante o seu!"}', 'draft', NOW());

-- Insert sample analytics events
INSERT INTO analytics_events (user_id, product_id, content_id, event_type, source, conversion_value, created_at) VALUES 
(2, 1, 1, 'view', 'instagram', 0, NOW() - INTERVAL '5 hours'),
(2, 1, 1, 'view', 'instagram', 0, NOW() - INTERVAL '4 hours'),
(2, 1, 1, 'click', 'instagram', 0, NOW() - INTERVAL '4 hours'),
(2, 1, 1, 'view', 'facebook', 0, NOW() - INTERVAL '3 hours'),
(2, 1, 1, 'click', 'facebook', 0, NOW() - INTERVAL '3 hours'),
(2, 1, 1, 'conversion', 'facebook', 1299.99, NOW() - INTERVAL '2 hours'),
(2, 2, 2, 'view', 'instagram', 0, NOW() - INTERVAL '1 hour'),
(2, 2, 2, 'click', 'instagram', 0, NOW() - INTERVAL '1 hour'),
(2, 3, 3, 'view', 'instagram', 0, NOW() - INTERVAL '30 minutes');