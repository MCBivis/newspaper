'use client';
import React from 'react';
import { useRouterContext, useRouterType, useLink } from '@refinedev/core';
import {theme, Space, Typography, Image} from 'antd';
import type { RefineLayoutThemedTitleProps } from '@refinedev/antd';

type Props = RefineLayoutThemedTitleProps & {
  width?: number;
  height?: number;
};

export const ThemedTitleV2: React.FC<Props> = ({
  collapsed,
  wrapperStyles,
  width,
  height,
}) => {
  const { token } = theme.useToken();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link;

  // Используем SVG логотип газеты как data URI
  const logoImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='20' width='80' height='60' fill='%238b5cf6' rx='4'/%3E%3Cline x1='20' y1='35' x2='80' y2='35' stroke='white' stroke-width='2'/%3E%3Cline x1='20' y1='50' x2='60' y2='50' stroke='white' stroke-width='2'/%3E%3Cline x1='20' y1='65' x2='70' y2='65' stroke='white' stroke-width='2'/%3E%3C/svg%3E";

  return (
    <ActiveLink
      to='/'
      style={{
        display: 'inline-block',
        textDecoration: 'none',
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 'inherit',
          justifyContent: collapsed ? 'center' : 'flex-start',
          width: '100%',
          padding: collapsed ? '0' : '0 16px',
          ...wrapperStyles,
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              color: token.colorPrimary,
              width: '100%',
              gap: '12px',
            }}
          >
            <Image
              src={logoImage}
              alt="Newspaper Logo"
              preview={false}
              width={32}
              height={32}
              style={{
                borderRadius: '8px',
                filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))',
              }}
            />
            <Typography.Title 
              level={4} 
              style={{ 
                margin: 0,
                whiteSpace: 'nowrap',
              }}
            >
              News<span style={{color: token.colorPrimary}}>paper</span>
            </Typography.Title>
          </div>
        )}

        {collapsed && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              color: token.colorPrimary,
            }}
          >
            <Image
              src={logoImage}
              alt="N"
              preview={false}
              width={28}
              height={28}
              style={{
                borderRadius: '6px',
              }}
            />
          </div>
        )}
      </div>
    </ActiveLink>
  );
};
