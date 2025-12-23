import { useCustom, useUpdate } from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";
import { API_URL } from "@utility/constants";
import { Button, Col, Layout, Row, Select, message } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Grid } from "./Grid";
import "./grid-stack.css";
const { Sider, Content } = Layout;

export type CustomLayout = {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  content: any;
  lock: boolean;
}[];

export type PageLayout = {
  [pageId: string]: CustomLayout;
};

type LayoutSettings = {
  editorJSData: JSON;
  columnCount: number;
  pageHeight: number;
  availableTextStyles: {
    fonts: Array<{
      fontFamily: string;
      name: string;
    }>;
  };
  pageWidth: number;
  horizontalFieldsWidth: number;
  verticalFieldsHeight: number;
  fontFamily: string;
  pagesCount: number;
};

type GridStackProps = {
  layoutSettings: LayoutSettings | null;
  issueDate: string;
  newspaperName: string;
  issueCover: any;
  issueId: number | string;
  issueStatus: string;
};

const GridStack: FC<GridStackProps> = ({
  layoutSettings,
  issueDate,
  newspaperName,
  issueId,
  issueCover,
  issueStatus,
}: GridStackProps) => {
  // Ensure minimum 2 pages
  const minPages = Math.max(layoutSettings?.pagesCount || 2, 2);
  const { availableTextStyles } = layoutSettings || {
    availableTextStyles: { fonts: [{ fontFamily: "Arial", name: "Arial" }] },
  };

  const { mutate } = useUpdate();
  const { data, isLoading, refetch } = useCustom<{
    data: {
      id: number;
      attributes: {
        id: number;
        issueData: any;
      };
    };
  }>({
    url: `${API_URL}/api/issues/${issueId}`,
    method: "get",
  });

  // Initialize pages based on pagesCount with minimum 2 pages
  const initializePages = (): PageLayout => {
    const initialPages: PageLayout = {};

    // First page - not editable, hardcoded layout
    initialPages["page1"] = createFirstPageLayout();

    // Initialize remaining pages (starting from page 2)
    for (let i = 2; i <= minPages; i++) {
      initialPages[`page${i}`] = []; // Each page starts with an empty layout
    }
    return initialPages;
  };

  // Function to create hardcoded layout for first page (cover page)
  const createFirstPageLayout = (): CustomLayout => {
    return [
      {
        id: "first-page-title",
        x: 0,
        y: 1,
        w: safeLayoutSettings.columnCount, // во всю ширину
        h: 2,
        content: {
          type: "text",
          text: `# ${newspaperName}`,
          fontFamily: layoutSettings?.fontFamily || "Arial",
        },
        lock: true, // заблокирован для редактирования
      },
      {
        id: "first-page-issue-cover",
        x: 0,
        y: 4,
        w: safeLayoutSettings.columnCount, // во всю ширину
        h: 12, // большая высота для изображения
        content: issueCover
          ? {
              type: "image",
              url: issueCover,
            }
          : {
              type: "text",
              text: "**Обложка выпуска**\n\n*Здесь будет отображаться обложка выпуска*",
              fontFamily: layoutSettings?.fontFamily || "Arial",
            },
        lock: true,
      },
      {
        id: "first-page-date",
        x: 0,
        y: 17,
        w: safeLayoutSettings.columnCount, // во всю ширину
        h: 2,
        content: {
          type: "text",
          text: `*${new Intl.DateTimeFormat("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(issueDate))} выпуск*`,
          fontFamily: layoutSettings?.fontFamily || "Arial",
        },
        lock: true,
      },
    ];
  };

  // Создаем safeLayoutSettings раньше, чтобы использовать в createFirstPageLayout
  const safeLayoutSettings = layoutSettings || {
    editorJSData: {} as JSON,
    columnCount: 4, // используем 4 колонки по умолчанию как требовалось
    pageHeight: 800,
    availableTextStyles: { fonts: [{ fontFamily: "Arial", name: "Arial" }] },
    pageWidth: 600,
    horizontalFieldsWidth: 50,
    verticalFieldsHeight: 50,
    fontFamily: "Arial",
    pagesCount: 2,
  };

  const [pages, setPages] = useState<PageLayout>(initializePages);

  // Функция для перевода английских текстов в блоках
  const translateBlockText = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    
    // Заменяем английские тексты на русские
    let translated = text;
    
    // Table of Contents
    translated = translated.replace(/# Table of Contents/gi, '# Оглавление');
    translated = translated.replace(/Table of Contents/gi, 'Оглавление');
    
    // Page X
    translated = translated.replace(/## Page (\d+)/gi, '## Страница $1');
    translated = translated.replace(/Page (\d+)/gi, 'Страница $1');
    
    // Edition
    translated = translated.replace(/\bedition\b/gi, 'выпуск');
    
    // Issue Cover
    translated = translated.replace(/\*\*Issue Cover\*\*/gi, '**Обложка выпуска**');
    translated = translated.replace(/Issue Cover/gi, 'Обложка выпуска');
    translated = translated.replace(/The issue cover will be displayed here/gi, 'Здесь будет отображаться обложка выпуска');
    
    // Removed Text
    translated = translated.replace(/Removed Text/gi, 'Удаленный текст');
    
    // Part X of Y
    translated = translated.replace(/Part (\d+) of (\d+)/gi, 'Часть $1 из $2');
    
    // Unknown Article
    translated = translated.replace(/Unknown Article/gi, 'Неизвестная статья');
    
    // No Articles Found
    translated = translated.replace(/### 📭 No Articles Found/gi, '### 📭 Статьи не найдены');
    translated = translated.replace(/No Articles Found/gi, 'Статьи не найдены');
    
    // Add some articles to other pages
    translated = translated.replace(/\*Add some articles to other pages to see them listed here\.\*/gi, '*Добавьте статьи на другие страницы, чтобы увидеть их здесь.*');
    translated = translated.replace(/Add some articles to other pages to see them listed here/gi, 'Добавьте статьи на другие страницы, чтобы увидеть их здесь');
    
    return translated;
  };

  // Функция для рекурсивного перевода текстов в виджетах
  const translateWidgetContent = (widget: any): any => {
    if (!widget || typeof widget !== 'object') return widget;
    
    const translated = { ...widget };
    
    // Переводим тексты в content
    if (translated.content) {
      if (typeof translated.content === 'string') {
        translated.content = translateBlockText(translated.content);
      } else if (translated.content.text) {
        translated.content = {
          ...translated.content,
          text: translateBlockText(translated.content.text)
        };
      } else if (translated.content.blocks && Array.isArray(translated.content.blocks)) {
        translated.content = {
          ...translated.content,
          blocks: translated.content.blocks.map((block: any) => {
            if (block.data && block.data.text) {
              return {
                ...block,
                data: {
                  ...block.data,
                  text: translateBlockText(block.data.text)
                }
              };
            }
            return block;
          })
        };
      }
    }
    
    // Переводим title
    if (translated.content?.title) {
      translated.content.title = translateBlockText(translated.content.title);
    }
    
    return translated;
  };

  const getIssueData = useCallback(async () => {
    const data = await refetch();
    const issueData = data.data?.data.data.attributes.issueData;

    // Если issueData пустой или null, используем инициализированные страницы
    if (
      issueData &&
      typeof issueData === "object" &&
      Object.keys(issueData).length > 0
    ) {
      // Исправляем позиции виджетов для корректного отображения
      const fixedIssueData = { ...issueData };

      Object.keys(fixedIssueData).forEach((pageKey) => {
        const pageWidgets = fixedIssueData[pageKey];
        if (Array.isArray(pageWidgets)) {
          // Переводим тексты в виджетах
          fixedIssueData[pageKey] = pageWidgets.map(translateWidgetContent);
          
          // Исправляем конкретно widget-3 (дата) если его y позиция неправильная
          const dateWidget = fixedIssueData[pageKey].find((w: any) => w.id === "widget-3");
          if (dateWidget && dateWidget.y === 0) {
            console.log("Fixing widget-3 position from y=0 to y=4");
            dateWidget.y = 4;
          }

          // Сортируем виджеты по Y позиции для правильного порядка
          fixedIssueData[pageKey].sort((a: any, b: any) => (a.y || 0) - (b.y || 0));
        }
      });

      // Всегда переопределяем первую страницу захардкоженным контентом
      fixedIssueData["page1"] = createFirstPageLayout();

      console.log("Loaded and fixed issue data:", fixedIssueData);
      setPages(fixedIssueData);
    } else {
      // Если данных нет, оставляем инициализированные страницы
      console.log("No issue data found, using initialized pages");
      setPages(initializePages());
    }
  }, [refetch]);

  useEffect(() => {
    getIssueData().then(() => console.log("done"));
  }, []);

  const [currentPage, setCurrentPage] = useState<string>("page1");
  const [selectedFont, setSelectedFont] = useState<string>(
    layoutSettings?.fontFamily || "Arial"
  );

  const updateLayoutHandle = useCallback(
    (layout: CustomLayout) => {
      setPages((prev) => ({ ...prev, [currentPage]: layout }));
    },
    [currentPage]
  );

  const addWidgetWithContent = (content: any) => {
    // Prevent adding widgets to page 1 (first page is not editable)
    if (currentPage === "page1") {
      console.warn("Cannot add widgets to page 1: First page is not editable");
      return;
    }

    if (!pages || !pages[currentPage]) {
      console.warn("Cannot add widget: pages or currentPage not available");
      return;
    }

    if (content.type === "text" && content.title && content.title.startsWith("Part")) {
      const partBase = content.title.replace(/\(returned\)/, '').trim();
      let foundOnPages: string[] = [];
      Object.entries(pages).forEach(([pageId, layout]) => {
        if (layout.some(
          (w) =>
            w.content?.type === "text" &&
            w.content?.title &&
            w.content.title.replace(/\(returned\)/, '').trim() === partBase
        )) {
          foundOnPages.push(pageId);
        }
      });
    }

    const pageLayout = pages[currentPage];

    console.log("Current page layout:", pageLayout);
    console.log(
      "Existing widgets positions:",
      pageLayout.map((w) => ({ id: w.id, x: w.x, y: w.y, h: w.h }))
    );

    // Находим максимальную Y позицию для размещения элемента снизу
    // Учитываем как позицию Y, так и высоту элемента
    const maxY =
      pageLayout.length > 0
        ? Math.max(
            ...pageLayout.map((widget) => (widget.y || 0) + (widget.h || 1))
          )
        : 0;

    console.log("Calculated maxY:", maxY);

    // Определяем размер в зависимости от типа контента и шаблона
    let width = 1; // по умолчанию 1 колонка
    let height = 3; // по умолчанию 3 ряда

    if (content.type === "image") {
      // Если это реклама с шаблоном, используем размеры из шаблона
      if (content.template) {
        width = content.template.widthInColumns;
        height = content.template.heightInRows;
        console.log(
          `Using template size: ${width}x${height} for advertisement "${content.template.name}"`
        );
      } else {
        // Размеры по умолчанию для изображений без шаблона
        width = 1;
        height = 4;
      }
    } else if (content.type === "text") {
      width = 1; // текст в одну колонку
      height = 4; // и повыше для читаемости
    }

    // Ищем свободное место в первой колонке
    let targetX = 0;
    let targetY = maxY;

    // Проверяем, есть ли место в первой колонке
    const conflictingWidget = pageLayout.find(
      (widget) =>
        (widget.x || 0) === targetX &&
        (widget.y || 0) < targetY + height &&
        (widget.y || 0) + (widget.h || 1) > targetY
    );

    // Если есть конфликт, размещаем во второй колонке
    if (conflictingWidget && safeLayoutSettings.columnCount > 1) {
      targetX = 1;
      // Ищем минимальную Y позицию во второй колонке
      const secondColumnWidgets = pageLayout.filter(
        (widget) => (widget.x || 0) === 1
      );
      targetY =
        secondColumnWidgets.length > 0
          ? Math.max(
              ...secondColumnWidgets.map(
                (widget) => (widget.y || 0) + (widget.h || 1)
              )
            )
          : 0;
    }

    // Добавляем новый элемент в конец массива (это важно для GridStack)
    const newWidget = {
      id: `${currentPage}-widget-${Date.now()}`, // Используем timestamp для уникальности
      x: targetX, // Умное позиционирование
      y: targetY, // Размещаем в свободном месте
      w: width, // Ширина из шаблона или по умолчанию
      h: height, // Высота из шаблона или по умолчанию
      content,
      lock: false,
    };

    console.log("New widget:", newWidget);

    setPages({
      ...pages,
      [currentPage]: [...pageLayout, newWidget], // Добавляем в конец массива
    });
  };

  const removeWidget = (id: string) => {
    if (!pages || !pages[currentPage]) {
      console.warn("Cannot remove widget: pages or currentPage not available");
      return;
    }

    const pageLayout = pages[currentPage];
    setPages({
      ...pages,
      [currentPage]: pageLayout.filter((block) => block.id !== id),
    });
  };

  const handleFontChange = (value: string) => {
    setSelectedFont(value);

    if (!pages || !pages[currentPage]) {
      console.warn("Cannot change font: pages or currentPage not available");
      return;
    }

    // Apply font change to all widgets in the current page
    const updatedLayout = pages[currentPage].map((widget) => ({
      ...widget,
      content: {
        ...widget.content,
        fontFamily: value,
      },
    }));
    setPages({
      ...pages,
      [currentPage]: updatedLayout,
    });
  };

  const gridElementMemo = useMemo(() => {
    // Добавляем проверку на существование pages и currentPage
    if (!pages || !pages[currentPage]) {
      return [];
    }

    const pageLayout = pages[currentPage];
    return pageLayout.map((layout_) => (
      <div
        className="widget"
        key={layout_.id}
        id={layout_.id}
        data-lock={layout_.lock}
        data-gs-w={layout_.w}
        data-gs-h={layout_.h}
        data-gs-x={layout_.x}
        data-gs-y={layout_.y}
        style={{ fontFamily: layout_.content?.fontFamily ?? "Arial" }}
      >
        {layout_.content?.type === "image" && (
          <div
            style={{
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "6px",
            }}
          >
            <img
              alt="issueCover"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
              src={`${API_URL}${layout_.content.url}`}
            />
          </div>
        )}
        {layout_.content?.type !== "image" && (
          <div data-color-mode="light">
            <MDEditor.Markdown
              source={
                typeof layout_.content === "string"
                  ? layout_.content
                  : layout_.content.text ||
                    layout_.content.blocks?.[0]?.data?.text ||
                    ""
              }
              style={{
                backgroundColor: "transparent",
                padding: "6px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            />
          </div>
        )}
      </div>
    ));
  }, [pages, currentPage]);

  // Функция для ручного сохранения данных
  const saveLayoutData = useCallback(async () => {
    if (pages && Object.keys(pages).length > 0) {
      console.log("Manual save triggered - saving layout data:", pages);
      try {
        await mutate({
          resource: "issues",
          id: issueId,
          values: {
            issueData: pages,
          },
          meta: {
            method: "put",
          },
          // Убираем уведомления отсюда - они будут в Grid.tsx
          successNotification: false,
          errorNotification: false,
        });
        return true;
      } catch (error) {
        console.error("Error saving layout:", error);
        return false;
      }
    }
    return false;
  }, [pages, mutate, issueId]);

  // Показываем загрузку если данные еще не загружены
  if (isLoading || !pages) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Загрузка...</div>
      </div>
    );
  }

  // Normal mode - with full layout
  return (
    <>
      {/* Обычный режим - показываем только текущую страницу */}
      <Layout style={{ height: "100%", width: "100%" }} className="no-print">
        {/* ── Left rail of page-circles ── */}
        <Sider
          width={64}
          style={{
            background: "#fafafa",
            padding: 16,
            textAlign: "center",
          }}
        >
          {pages &&
            Object.keys(pages).map((pageId, idx) => (
              <Button
                key={pageId}
                shape="circle"
                size="small"
                onClick={() => setCurrentPage(pageId)}
                type={currentPage === pageId ? "primary" : "default"}
                style={{ margin: "8px 0" }}
              >
                {idx + 1}
              </Button>
            ))}
        </Sider>

        {/* ── Main area with toolbar + grid ── */}
        <Content style={{ padding: 0, overflow: "auto" }}>
          {/* ── Sticky Toolbar ── */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "#fff",
              padding: "8px 16px",
              borderBottom: "1px solid #eee",
            }}
          >
            <Row align="middle" justify="space-between">
              {/* Font Selector */}
              <Col>
                <span style={{ marginRight: 8, fontWeight: 500 }}>Шрифт:</span>
                <Select
                  value={selectedFont}
                  onChange={handleFontChange}
                  style={{ width: 200 }}
                  dropdownMatchSelectWidth={false}
                >
                  {(availableTextStyles?.fonts || []).map((font) => (
                    <Select.Option
                      key={font.fontFamily}
                      value={font.fontFamily}
                    >
                      <span style={{ fontFamily: font.fontFamily }}>
                        {font.name}
                      </span>
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>

          {/* ── Grid Component ── */}
          <div style={{ padding: 16 }}>
            <Grid
              layout={pages && pages[currentPage] ? pages[currentPage] : []}
              allLayouts={pages || {}}
              layoutSettings={layoutSettings}
              updateLayoutHandle={updateLayoutHandle}
              addWidgetWithContent={addWidgetWithContent}
              removeWidget={removeWidget}
              onChangeLayout={(newLayout) =>
                setPages((prev) => ({ ...prev, [currentPage]: newLayout }))
              }
              onSaveLayout={saveLayoutData}
              currentPageNumber={
                pages ? Object.keys(pages).indexOf(currentPage) + 1 : 1
              }
              totalPages={pages ? Object.keys(pages).length : 1}
              issueDate={issueDate}
              newspaperName={newspaperName}
              currentFont={selectedFont}
              issueCover={issueCover}
              issueStatus={issueStatus}
              issueId={issueId}
            >
              {gridElementMemo}
            </Grid>
          </div>
        </Content>
      </Layout>

      {/* Режим печати - показываем все страницы в режиме предварительного просмотра */}
      <div className="print-only" style={{ display: "none" }}>
        {pages &&
          Object.keys(pages).map((pageId, idx) => {
            const pageLayout = pages[pageId] || [];
            const pageNumber = idx + 1;
            const totalPagesCount = Object.keys(pages).length;

            return (
              <div
                key={pageId}
                className={`newspaper-page-${pageNumber} newspaper-preview-container`}
                style={{
                  backgroundColor: "#ffffff",
                  height: safeLayoutSettings.pageHeight,
                  fontFamily: selectedFont,
                  fontSize: "14px",
                  position: "relative",
                  margin: 0,
                  padding: 0,
                }}
              >
                {/* Header - показываем на всех страницах кроме первой */}
                {pageNumber !== 1 && (
                  <header
                    style={{
                      height: "30px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #ddd",
                      padding: "5px 10px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <span style={{ margin: 0 }}>
                      {new Intl.DateTimeFormat("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(issueDate))}
                    </span>
                    <span style={{ margin: 0 }}>{newspaperName}</span>
                  </header>
                )}

                {/* Main Content Area */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    height:
                      pageNumber !== 1
                        ? safeLayoutSettings.pageHeight - 60 // Вычитаем header и footer
                        : safeLayoutSettings.pageHeight - 30, // Только footer
                    position: "relative",
                    paddingLeft: safeLayoutSettings.horizontalFieldsWidth,
                    paddingRight: safeLayoutSettings.horizontalFieldsWidth,
                    paddingTop: safeLayoutSettings.verticalFieldsHeight,
                    paddingBottom: safeLayoutSettings.verticalFieldsHeight,
                    boxSizing: "border-box",
                  }}
                >
                  {/* Render page content in preview style */}
                  {pageLayout.map((item) => {
                    const columnWidth =
                      (safeLayoutSettings.pageWidth -
                        safeLayoutSettings.horizontalFieldsWidth * 2) /
                      safeLayoutSettings.columnCount;
                    const rowHeight = 40;

                    return (
                      <div
                        key={item.id}
                        className="preview-item"
                        style={{
                          position: "absolute",
                          left: (item.x || 0) * columnWidth,
                          top: (item.y || 0) * rowHeight,
                          width: (item.w || 1) * columnWidth,
                          height: (item.h || 1) * rowHeight,
                          overflow: "hidden",
                        }}
                      >
                        {item.content?.type === "image" ? (
                          <div
                            style={{
                              overflow: "hidden",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "6px",
                            }}
                          >
                            <img
                              alt="content"
                              style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit:
                                  item.id === "first-page-issue-cover"
                                    ? "cover"
                                    : "contain",
                                borderRadius:
                                  item.id === "first-page-issue-cover"
                                    ? "8px"
                                    : "0px",
                              }}
                              src={`${API_URL}${item.content.url}`}
                            />
                          </div>
                        ) : (
                          <div data-color-mode="light">
                            <MDEditor.Markdown
                              source={
                                typeof item.content === "string"
                                  ? item.content
                                  : item.content.text ||
                                    item.content.blocks?.[0]?.data?.text ||
                                    ""
                              }
                              style={{
                                backgroundColor: "transparent",
                                padding: "6px",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                lineHeight: "1.4",
                                textAlign:
                                  item.id === "first-page-title" ||
                                  item.id === "first-page-date"
                                    ? "center"
                                    : "left",
                                fontSize:
                                  item.id === "first-page-title"
                                    ? "24px"
                                    : item.id === "first-page-date"
                                    ? "16px"
                                    : "inherit",
                                fontWeight:
                                  item.id === "first-page-title"
                                    ? "bold"
                                    : "inherit",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer - показываем на всех страницах кроме первой */}
                {pageNumber !== 1 && (
                  <footer
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      height: "30px",
                      padding: "5px 10px",
                      textAlign: "center",
                      borderTop: "1px solid #ddd",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: "#f8f9fa",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      Страница {pageNumber} из {totalPagesCount}
                    </span>
                  </footer>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default GridStack;
