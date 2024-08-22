-- V4__models.sql

-- Inserting Generated 1
INSERT INTO models (name, source_file, version, based, create_date, delete_date, update_date, description,
                    user_id, favorite)
VALUES ('Generated XML 1', '<?xml version="1.0" encoding="UTF-8"?>
<devsModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:noNamespaceSchemaLocation="your-schema.xsd">

  <component>ComponentA</component>
  <component>ComponentB</component>

  <connections>
    <connection source="ComponentA" target="ComponentB"/>
  </connections>

</devsModel>', 1, null, now(), null, null, 'Test model 1', 1, null);

-- Inserting Generated XML 2
INSERT INTO models (name, source_file, version, based, create_date, delete_date, update_date, description,
                    user_id, favorite)
VALUES ('Generated XML 2', '<?xml version="1.0" encoding="UTF-8"?>
<devsModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:noNamespaceSchemaLocation="your-schema.xsd">

  <component>ComponentX</component>
  <component>ComponentY</component>

  <connections>
    <connection source="ComponentX" target="ComponentY"/>
  </connections>

</devsModel>', 1, null, now(), null, null, 'Test model 2', 1, null);