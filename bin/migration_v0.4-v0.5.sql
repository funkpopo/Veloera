-- 礼包码时间范围限制功能迁移脚本
-- 添加生效时间和过期时间字段

-- 为MySQL数据库添加新字段
ALTER TABLE redemptions ADD COLUMN valid_from BIGINT DEFAULT 0 COMMENT '生效时间，0表示立即生效';
ALTER TABLE redemptions ADD COLUMN valid_until BIGINT DEFAULT 0 COMMENT '过期时间，0表示永不过期';

-- 为PostgreSQL数据库添加新字段（如果使用PostgreSQL）
-- ALTER TABLE redemptions ADD COLUMN valid_from BIGINT DEFAULT 0;
-- ALTER TABLE redemptions ADD COLUMN valid_until BIGINT DEFAULT 0;
-- COMMENT ON COLUMN redemptions.valid_from IS '生效时间，0表示立即生效';
-- COMMENT ON COLUMN redemptions.valid_until IS '过期时间，0表示永不过期';

-- 为SQLite数据库添加新字段（如果使用SQLite）
-- ALTER TABLE redemptions ADD COLUMN valid_from INTEGER DEFAULT 0;
-- ALTER TABLE redemptions ADD COLUMN valid_until INTEGER DEFAULT 0; 