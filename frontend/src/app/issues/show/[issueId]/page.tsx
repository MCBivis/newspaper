"use client";

import GridStack from "@components/Gridstack";
import { useTable } from "@refinedev/antd";
import { Layout } from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const {Content } = Layout;

const relationsQuery = {
    populate: {
        newspaper: {
            populate: {
                layout: true,
                photo: true,
                issues: true,
            },
        },
        cover: {
            populate: "*",
        },
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

type NewspaperType = {
    id: string | number;
    name: string;
    cover: string;
    layout: LayoutType;
};

type IssueType = {
    id: string | number;
    status: string;
    name: string;
    PublishDate: string;
    newspaper: NewspaperType;
    cover: any;
};

export default function IssueShow() {
    const { issueId } = useParams();
    const searchParams = useSearchParams();
    const newspaperId = searchParams.get("newspaperId");

    // Strapi expects numeric IDs; fallback to raw string if parse fails
    const parsedIssueId = Number(issueId);
    const parsedNewspaperId = newspaperId ? Number(newspaperId) : undefined;

    const { tableProps } = useTable<IssueType>({
        resource: "issues",
        meta: relationsQuery,
        syncWithLocation: false,
        filters: {
            permanent: [
                {
                    field: "id",
                    operator: "eq",
                    value: Number.isNaN(parsedIssueId) ? issueId : parsedIssueId,
                },
                // Filter by newspaper only if provided; otherwise allow any newspaper
                ...(parsedNewspaperId !== undefined && !Number.isNaN(parsedNewspaperId)
                    ? [
                        {
                            field: "newspaper.id",
                            operator: "eq" as const,
                            value: parsedNewspaperId,
                        },
                    ]
                    : []),
            ],
        },
    });

    const [issue, setIssue] = useState<IssueType>();

    useEffect(() => {
        setIssue(tableProps.dataSource?.[0]);
    }, [tableProps.dataSource]);

    if (tableProps.loading) return <p>Загрузка...</p>;
    if (!issue) return <p>Выпуск не найден</p>;

    return (
        <Layout style={{ height: "100vh" }}>
            <Layout>
                <Content style={{ position: "relative", overflow: "auto" }}>
                    <GridStack
                        layoutSettings={issue.newspaper.layout as any}
                        issueDate={issue.PublishDate}
                        newspaperName={issue.newspaper.name}
                        issueCover={issue.cover?.url}
                        issueId={issue.id}
                        issueStatus={issue.status}
                    />
                </Content>
            </Layout>
        </Layout>
    );
}