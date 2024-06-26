import styles from "./MainContent.module.css";
import React, { Fragment } from "react";
import DownloadPDFBtn from "./DownloadPDFBtn";
import { useBooks } from "./contexts/BooksContext";
import { books } from "../articles";
import { FaFont } from "react-icons/fa";
import PrevNextChapter from "./PrevNextChapter";

export default function MainContent() {
  const {
    selectedBook,
    handleOpenModal,
    handleIncreaseFontSize,
    handleDecreaseFontSize,
    currentChapterIndex,
    fontSize,
  } = useBooks();

  const handleDownload = (url, download) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = download;
    anchor.target = "_blank";
    anchor.click();
  };

  return (
    <div className={styles.content}>
      {books.map((book) => {
        const {
          id,
          bookTitle,
          bookSubtitle,
          description,
          content,
          url,
          download,
        } = book;
        if (selectedBook && selectedBook.id === id) {
          return (
            <div key={id} className={styles.book}>
              {currentChapterIndex === 0 && (
                <div>
                  <h1>{bookTitle}</h1>
                  <h4>{bookSubtitle}</h4>
                  {description.map((desc, index) => (
                    <p className={styles.description} key={index}>
                      {desc}
                    </p>
                  ))}
                </div>
              )}
              <div className={styles.downloadAndFont}>
                <div className={styles.changeFontSize}>
                  <FaFont
                    className={styles.btn}
                    onClick={handleIncreaseFontSize}
                  ></FaFont>
                  <FaFont
                    className={styles.btn}
                    onClick={handleDecreaseFontSize}
                  ></FaFont>
                </div>
                <DownloadPDFBtn
                  onDownload={handleDownload}
                  url={url}
                  download={download}
                />
              </div>
              {content.map((chapter, chapterIndex) => {
                if (chapterIndex === currentChapterIndex) {
                  const { title, text, chapterId, bookTags } = chapter;
                  return (
                    <div
                      className={styles["book-content"]}
                      key={chapterIndex}
                      id={chapterId}
                    >
                      <PrevNextChapter />
                      <h2
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: 1.5,
                        }}
                      >
                        {title}
                      </h2>
                      {Array.isArray(text) ? (
                        text.map((paragraph, paragraphIndex) => {
                          const hasSymbol =
                            typeof paragraph === "string" &&
                            paragraph.includes("💡");
                          return (
                            <p
                              key={paragraphIndex}
                              style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: 1.5,
                              }}
                            >
                              {hasSymbol
                                ? paragraph.split("💡").map((tag, index) => {
                                    const localTag = bookTags.find(
                                      (el) => el.contentId === paragraphIndex
                                    );
                                    return (
                                      <Fragment key={index}>
                                        {index > 0 && (
                                          <span
                                            aria-label="bulb"
                                            role="img"
                                            className={styles.symbol}
                                            onClick={() =>
                                              handleOpenModal(localTag.text)
                                            }
                                          >
                                            💡
                                          </span>
                                        )}
                                        {tag}
                                      </Fragment>
                                    );
                                  })
                                : paragraph}
                            </p>
                          );
                        })
                      ) : (
                        <p key={chapterIndex}>{text}</p>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        return null;
      })}
      <PrevNextChapter />
    </div>
  );
}
