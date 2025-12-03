"use client";

import {
  DeleteButton,
  useTable,
} from "@refinedev/antd";
import { Card, Col, Row, Space } from "antd";

const relationsQuery = {
  populate: {
    issues: {
      populate: "*",
    },
    layout: {
      populate: "*",
    },
    photo: "*",
  },
};

type LayoutType = {
  editorJSData: JSON;
  columnCount: number;
  pageHeight: number;
  availableTextStyles: JSON;
  pageWidth: number;
  horizontalFieldsWidth: number;
  verticalFieldsHeight: number;
  fontFamily: string;
  pagesCount: number;
};

type IssueType = {
  name: string;
  status: string;
  PublishDate: Date;
};

const STRAPI_BASE_URL = "http://localhost:1338";

export default function NewspaperList() {
  const { tableProps } = useTable<{
    id: number | string;
    name: string;
    cover: string; // cover is a URL to the image
    layout: LayoutType;
    fontFamily: string;
    height: string;
    issues: IssueType[];
  }>({
    syncWithLocation: true,
    meta: relationsQuery,
    sorters: {
      initial: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
  });

  // Assuming this is the base URL for your Strapi media (adjust this to your actual base URL)
  // or your production URL

  return (
    <div style={{ padding: '24px', background: 'transparent' }}>
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 700, 
        marginBottom: '32px',
        color: '#1a1a1a',
        letterSpacing: '-0.5px'
      }}>
        Newspapers
      </h1>
      <Row gutter={[24, 24]}>
        {tableProps?.dataSource?.map((newspaper: any) => (
          <Col span={8} key={newspaper.id}>
            <Card
              hoverable
              style={{
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0',
              }}
              bodyStyle={{ padding: '20px' }}
              cover={
                newspaper.photo?.url ? (
                  <div
                    style={{
                      height: "200px", // Fixed height for the container
                      overflow: "hidden", // Hide overflow to prevent cropping
                      display: "flex", // Use flexbox to center the image
                      justifyContent: "center", // Center horizontally
                      alignItems: "center", // Center vertically
                      padding: "10px", // Add padding around the image
                    }}
                  >
                    <img
                      alt="newspaper"
                      style={{
                        maxHeight: "100%", // Ensure the image does not exceed the container height
                        maxWidth: "100%", // Ensure the image does not exceed the container width
                        objectFit: "contain", // Maintain aspect ratio and fit within the container
                      }}
                      src={`${STRAPI_BASE_URL}${newspaper.photo.url}`}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: "200px", // Fixed height for the container
                      overflow: "hidden", // Hide overflow to prevent cropping
                      display: "flex", // Use flexbox to center the image
                      justifyContent: "center", // Center horizontally
                      alignItems: "center", // Center vertically
                      padding: "10px", // Add padding around the image
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    No image
                  </div>
                )
              } // Load the image
            >
              <Card.Meta 
                title={
                  <span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                    {newspaper.name}
                  </span>
                } 
              />
              <p style={{ 
                marginTop: '12px', 
                marginBottom: '16px',
                color: '#64748b',
                fontSize: '14px'
              }}>
                Issues: {newspaper.issues.length}
              </p>
              <Space>
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={newspaper.id}
                />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
