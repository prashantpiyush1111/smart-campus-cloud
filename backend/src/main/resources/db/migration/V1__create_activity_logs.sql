-- Keep this migration safe for installations where Hibernate has already
-- created the table. Flyway will manage the migration history going forward.
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_email VARCHAR(120) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100),
    entity_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(50),
    timestamp DATETIME NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_act_timestamp (timestamp),
    INDEX idx_act_user (user_email)
);
