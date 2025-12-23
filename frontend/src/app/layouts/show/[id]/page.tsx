"use client";

import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function LayoutShow() {
    const { queryResult } = useShow({
        meta: {
            populate: ["category"],
        },
    });
    const { data, isLoading } = queryResult;

    const record = data?.data;

    const renderAvailableTextStyles = (value: any) => {
        let fonts: any[] = [];
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                fonts = parsed.fonts || [];
            } catch {
                fonts = [];
            }
        } else if (value && typeof value === 'object' && Array.isArray(value.fonts)) {
            fonts = value.fonts;
        }
        if (!fonts.length) return '-';
        return (
            <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #d9d9d9' }}>
                <thead>
                <tr>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 'bold', fontSize: 12, border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>Название</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 'bold', fontSize: 12, border: '1px solid #d9d9d9', backgroundColor: '#fafafa' }}>Шрифт</th>
                </tr>
                </thead>
                <tbody>
                {fonts.map((font, idx) => (
                    <tr key={idx}>
                        <td style={{ padding: '4px 8px', fontSize: 12, border: '1px solid #d9d9d9' }}>{font.name}</td>
                        <td style={{ padding: '4px 8px', fontFamily: font.fontFamily, fontSize: 12, border: '1px solid #d9d9d9' }}>{font.fontFamily}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>{"ID"}</Title>
            <TextField value={record?.id} />
            <Title level={5}>{"Количество колонок"}</Title>
            <TextField value={record?.columnCount} />
            <Title level={5}>{"Высота страницы"}</Title>
            <TextField value={record?.pageHeight} />
            <Title level={5}>{"Доступные стили текста"}</Title>
            {renderAvailableTextStyles(record?.availableTextStyles)}
            <Title level={5}>{"Ширина страницы"}</Title>
            <TextField value={record?.pageWidth} />
            <Title level={5}>{"Ширина горизонтальных полей"}</Title>
            <TextField value={record?.horizontalFieldsWidth} />
            <Title level={5}>{"Высота вертикальных полей"}</Title>
            <TextField value={record?.verticalFieldsHeight} />
            <Title level={5}>{"Шрифт"}</Title>
            <TextField value={record?.fontFamily} />
            <Title level={5}>{"Количество страниц"}</Title>
            <TextField value={record?.pagesCount} />
        </Show>
    );
}