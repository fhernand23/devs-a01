INSERT INTO schemas
(based, create_date, delete_date, description, name, source_file, update_date, version, user_id)
VALUES (null, now(), null, 'DEVS Formalization Model', 'DEVS Formalization Model', '<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <!-- Define the DEVS model element -->
  <xs:element name="devsModel">
    <xs:complexType>
      <xs:sequence>
        <!-- Define elements for your DEVS model here -->
        <xs:element name="component" type="xs:string" minOccurs="1" maxOccurs="unbounded"/>
        <xs:element name="connections">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="connection" minOccurs="1" maxOccurs="unbounded">
                <xs:complexType>
                  <xs:attribute name="source" type="xs:string" use="required"/>
                  <xs:attribute name="target" type="xs:string" use="required"/>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
', null, 1, 1);