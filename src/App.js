import React, { useState, useEffect, Fragment } from "react";
import { books } from "./articles";
import { aboutAuthor } from "./articles";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import authorImage from "./assets/author.jpg";

export default function App() {
  const [selectedBook, setSelectedBook] = useState("");
  const [showAboutAuthor, setShowAboutAuthor] = useState(false);
  const [isBurgerMenu, setIsBurgerMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([0]);

  const handleModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSymbolClick = (content) => {
    setModalContent(content);
    setShowModal(true);
  };
  const handleAboutAuthorClick = () => {
    setShowAboutAuthor(true);
    setIsBurgerMenu(false);
  };

  const handleSelectChange = (event) => {
    setSelectedBook(event.target.value);
  };

  const handleExitClick = () => {
    setShowAboutAuthor(false);
  };

  const handleBurgerMenu = () => {
    setIsBurgerMenu((isBurgerMenu) => !isBurgerMenu);
  };

  useEffect(() => {
    setSelectedBook(books[0]?.bookTitle || "");
  }, []);

  return (
    <Fragment>
      {!showAboutAuthor && (
        <button className="nav-btn" onClick={handleBurgerMenu}>
          {isBurgerMenu ? <FaTimes /> : <FaBars />}
        </button>
      )}
      <Header
        handleSelectChange={handleSelectChange}
        onAboutAuthorClick={handleAboutAuthorClick}
        showAboutAuthor={showAboutAuthor}
      />
      {isBurgerMenu && (
        <BurgerMenu
          onAboutAuthorClick={handleAboutAuthorClick}
          showAboutAuthor={showAboutAuthor}
        />
      )}
      <ContainerWrapper>
        {showAboutAuthor && (
          <AboutAuthor
            showAboutAuthor={showAboutAuthor}
            onExitClick={handleExitClick}
          />
        )}
        {!showAboutAuthor && (
          <MainContent
            selectedBook={selectedBook}
            books={books}
            onShowModal={handleModal}
            onSymbolClick={handleSymbolClick}
          />
        )}
        {showModal && (
          <SymbolModal onClose={handleCloseModal} content={modalContent} />
        )}
      </ContainerWrapper>
      <BackToTopButton />
    </Fragment>
  );
}

// ModalScreen
function SymbolModal({ onClose, content }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}>
          <FaTimes />
        </button>
        <div className="symbol-explanation">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}

//MainContent
function MainContent({ selectedBook, books, onShowModal, onSymbolClick }) {
  const handleDownload = (url, download) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = download;
    anchor.target = "_blank";
    anchor.click();
  };

  return (
    <div className="content">
      <h3 className="author">Михаил Наёгирняк</h3>
      {books.map((book) => {
        const {
          id,
          bookTitle,
          bookSubtitle,
          description,
          content,
          url,
          download,
          bookTags,
        } = book;

        if (selectedBook === bookTitle) {
          return (
            <div key={id} className="book">
              <button
                className="download"
                onClick={() => handleDownload(url, download)}
              >
                PDF
              </button>
              <h1>{bookTitle}</h1>
              <h4>{bookSubtitle}</h4>
              {description.map((desc, index) => (
                <p className="description" key={index}>
                  {desc}
                </p>
              ))}
              {content.map((chapter, chapterIndex) => {
                const { title, text } = chapter;
                return (
                  <div className="book-content" key={chapterIndex}>
                    <h2>{title}</h2>
                    {Array.isArray(text) ? (
                      text.map((paragraph, paragraphIndex) => {
                        const hasSymbol =
                          typeof paragraph === "string" &&
                          paragraph.includes("💡");
                        return (
                          <p key={paragraphIndex}>
                            {hasSymbol
                              ? paragraph.split("💡").map((tag, index) => {
                                  let symbolIndex = 0;
                                  const associatedTag = bookTags[symbolIndex++];
                                  return (
                                    <Fragment key={index}>
                                      {index > 0 && (
                                        <span
                                          className="symbol"
                                          onClick={() =>
                                            onSymbolClick(associatedTag)
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
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ContainerWrapper
function ContainerWrapper({ children }) {
  return <div className="container">{children}</div>;
}

//Header
function Header({ handleSelectChange, onAboutAuthorClick, showAboutAuthor }) {
  return (
    <header className="header">
      <h1>Христианские рассказы</h1>
      {!showAboutAuthor && (
        <SelectorForm handleSelectChange={handleSelectChange} />
      )}
      <nav className="header-menu">
        <div className="header-btn">
          {!showAboutAuthor && (
            <AboutAuthorButton onAboutAuthorClick={onAboutAuthorClick} />
          )}
        </div>
      </nav>
    </header>
  );
}

function BurgerMenu({ onAboutAuthorClick, showAboutAuthor, onExitClick }) {
  return (
    <div className="burger-menu">
      <div className="burger-menu-content">
        <AboutAuthorButton
          showAboutAuthor={showAboutAuthor}
          onExitClick={onExitClick}
          onAboutAuthorClick={onAboutAuthorClick}
        />
      </div>
    </div>
  );
}

//AboutAuthorButton

function AboutAuthorButton({ onAboutAuthorClick }) {
  return (
    <button onClick={onAboutAuthorClick} className="about-author-btn">
      Об авторе
    </button>
  );
}

//SelectorForm

function SelectorForm({ handleSelectChange }) {
  return (
    <form className="form-center">
      <label htmlFor="book-selector">Выберите книгу</label>
      <select id="book-selector" onChange={handleSelectChange}>
        {books.map((book) => {
          const { id, bookTitle } = book;
          return <option key={id}>{bookTitle}</option>;
        })}
      </select>
    </form>
  );
}

//Back to top button

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.pageYOffset > 800 ||
        document.documentElement.scrollTop > 800
      ) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`${"backToTop"} ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </div>
  );
}

//About Author

function AboutAuthor({ showAboutAuthor, onExitClick }) {
  if (!showAboutAuthor) return null;
  return (
    <div className="about-author">
      <div className="about-author__center">
        <div className="about-author__image">
          <img src={authorImage} alt="Author Image" />
        </div>
        <div className="about-author-desc">
          {aboutAuthor.map((about) => {
            const { title, content } = about;
            return (
              <>
                <h1>{title}</h1>
                {content.map((paragraph, index) => {
                  return <p key={index}>{paragraph}</p>;
                })}
              </>
            );
          })}
        </div>
      </div>
      <div className="about-author-back">
        <button onClick={onExitClick}>Назад</button>
      </div>
    </div>
  );
}
