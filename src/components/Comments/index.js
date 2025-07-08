import { Component } from "react";

import Header from "../Header";

import { CiSearch } from "react-icons/ci";
import {
  FaLessThan,
  FaGreaterThan,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

import "./index.css";

class Comments extends Component {
  state = {
    commentsList: [],
    currentPage: 1,
    pageSize: 10,
    searchInput: "",
    sortByColumnName: "",
    sortingOrder: null,
  };

  componentDidMount() {
    const previousSavedData = localStorage.getItem("commentsState");
    if (previousSavedData) {
      const parsedData = JSON.parse(previousSavedData);
      this.setState(
        {
          ...parsedData,
          pageSize: parseInt(parsedData.pageSize),
        },
        this.getCommentsList
      );
    } else {
      this.getCommentsList();
    }
  }

  saveState = () => {
    const {
      currentPage,
      pageSize,
      searchInput,
      sortByColumnName,
      sortingOrder,
    } = this.state;
    const previousState = {
      currentPage,
      pageSize,
      searchInput,
      sortByColumnName,
      sortingOrder,
    };
    localStorage.setItem("commentsState", JSON.stringify(previousState));
  };

  getCommentsList = async () => {
    const url = `https://jsonplaceholder.typicode.com/comments`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    this.setState({
      commentsList: data,
    });
  };

  onChangePageSize = (event) => {
    this.setState(
      {
        pageSize: event.target.value,
      },
      this.saveState
    );
  };

  getPaginatedCommentsList = () => {
    const { commentsList, currentPage, pageSize } = this.state;
    const startIndex = (currentPage - 1) * pageSize; // Indexing starts from 0th position
    const endIndex = startIndex + pageSize;
    return commentsList.slice(startIndex, endIndex);
  };

  onClickNext = () => {
    const { currentPage, pageSize } = this.state;
    if (currentPage * pageSize < 500) {
      // This logic prevents the page number from increasing if the comments count exceeds 500.
      this.setState(
        (prevState) => ({
          currentPage: prevState.currentPage + 1,
        }),
        this.saveState
      );
    }
  };

  onClickPreviousPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState(
        (prevState) => ({
          currentPage: prevState.currentPage - 1,
        }),
        this.saveState
      );
    }
  };

  onClickNextPage = () => {
    const { currentPage, pageSize } = this.state;
    if (currentPage * pageSize < 500) {
      this.setState(
        (prevState) => ({
          currentPage: prevState.currentPage + 1,
        }),
        this.saveState
      );
    }
  };

  onChangeSearchInput = (event) => {
    const value = event.target.value.toLowerCase();
    this.setState(
      {
        searchInput: value,
      },
      this.saveState
    );
  };

  getSearchBasedComments = (comments) => {
    const { searchInput } = this.state;
    const list = comments.filter((each) => {
      const name = each.name.toLowerCase();
      const email = each.email.toLowerCase();
      const body = each.body.toLowerCase(); // there is no phone number here

      return (
        name.includes(searchInput) ||
        email.includes(searchInput) ||
        body.includes(searchInput)
      );
    });
    return list;
  };

  onClickSort = (columnName) => {
    const { sortByColumnName, sortingOrder } = this.state;
    const isSame = sortByColumnName === columnName;
    let updatedSortingOrder;
    if (isSame) {
      if (sortingOrder === null) {
        updatedSortingOrder = "ASC";
      } else if (sortingOrder === "ASC") {
        updatedSortingOrder = "DESC";
      } else {
        updatedSortingOrder = null;
      }
      this.setState(
        {
          sortByColumnName: columnName,
          sortingOrder: updatedSortingOrder,
        },
        this.saveState
      );
    } else {
      this.setState(
        {
          sortByColumnName: columnName,
          sortingOrder: "ASC",
        },
        this.saveState
      );
    }
  };

  ascendingOrder = (searchBasedComments) => {
    searchBasedComments.sort((a, b) => a.postId - b.postId);
    return searchBasedComments;
  };

  descendingOrder = (searchBasedComments) => {
    searchBasedComments.sort((a, b) => b.postId - a.postId);
    return searchBasedComments;
  };

  postBasedComments = (searchBasedComments) => {
    const { sortingOrder } = this.state;
    switch (sortingOrder) {
      case "ASC":
        return this.ascendingOrder(searchBasedComments);
      case "DESC":
        return this.descendingOrder(searchBasedComments);
      case null:
        return searchBasedComments;

      default:
        return null;
    }
  };

  getAscending = (columnName, searchBasedComments) => {
    searchBasedComments.sort((a, b) =>
      a[columnName].localeCompare(b[columnName])
    );
    return searchBasedComments;
  };

  getDescending = (columnName, searchBasedComments) => {
    searchBasedComments.sort((a, b) =>
      b[columnName].localeCompare(a[columnName])
    );
    return searchBasedComments;
  };

  stringBasedComments = (columnName, searchBasedComments) => {
    const { sortingOrder } = this.state;
    switch (sortingOrder) {
      case "ASC":
        return this.getAscending(columnName, searchBasedComments);
      case "DESC":
        return this.getDescending(columnName, searchBasedComments);
      case null:
        return searchBasedComments;
      default:
        return null;
    }
  };

  getSortBasedComment = (searchBasedComments) => {
    const { sortByColumnName } = this.state;
    if (sortByColumnName === "postId") {
      return this.postBasedComments(searchBasedComments);
    } else if (sortByColumnName === "name") {
      return this.stringBasedComments("name", searchBasedComments);
    } else if (sortByColumnName === "email") {
      return this.stringBasedComments("email", searchBasedComments);
    }
    return searchBasedComments;
  };

  getSortIcon = (columnName) => {
    const { sortByColumnName, sortingOrder } = this.state;
    if (sortByColumnName !== columnName || sortingOrder === null) {
      return <FaSort className="scroll-icon" />;
    }
    if (sortingOrder === "ASC") {
      return <FaSortUp className="scroll-icon" />;
    }
    return <FaSortDown className="scroll-icon" />;
  };

  render() {
    const { commentsList, currentPage, pageSize, searchInput } = this.state;

    const totalCommentsCount = commentsList.length;

    const startingPageNumber = (currentPage - 1) * pageSize + 1;
    let endingPageNumber = currentPage * pageSize;
    if (endingPageNumber > 500) {
      endingPageNumber = 500;
    }

    const paginatedComments = this.getPaginatedCommentsList();

    const searchBasedComments = this.getSearchBasedComments(paginatedComments);

    const sortBasedComments = this.getSortBasedComment(searchBasedComments);

    const hideNumber = currentPage * pageSize >= 500 ? "hide" : null;

    if (commentsList.length === 0) {
      return (
        <div className="loader-container">
          <TailSpin color="#0b69ff" height="50" width="50" />
        </div>
      );
    }
    return (
      <>
        <Header />
        <div className="comments-container">
          <div className="filter-container">
            <div className="sort-by-container">
              <button
                type="button"
                className="sort-button"
                onClick={() => this.onClickSort("postId")}
              >
                <span className="sort-button-text">Sort Post ID</span>
                {this.getSortIcon("postId")}
              </button>
              <button
                type="button"
                className="sort-button"
                onClick={() => this.onClickSort("name")}
              >
                <span className="sort-button-text">Sort Name</span>
                {this.getSortIcon("name")}
              </button>
              <button
                type="button"
                className="sort-button"
                onClick={() => this.onClickSort("email")}
              >
                <span className="sort-button-text">Sort Email</span>
                {this.getSortIcon("email")}
              </button>
            </div>
            <div className="search-container">
              <CiSearch className="search-icon" />
              <input
                type="search"
                className="search-input"
                placeholder="Search name,email,comment"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
            </div>
          </div>
          <div className="dashboard-container">
            <div className="header-cell-container">
              <p className="header-cell-name first-cell">Post ID</p>
              <p className="header-cell-name">Name</p>
              <p className="header-cell-name">Email</p>
              <p className="header-cell-name">Comment</p>
            </div>

            {sortBasedComments.map((each) => (
              <div className="post-container" key={each.id}>
                <p className="cell first-cell">{each.postId}</p>
                <p className="cell">{each.name}</p>
                <p className="cell">{each.email}</p>
                <p className="cell">{each.body.slice(0, 30)}...</p>
              </div>
            ))}
          </div>
          <div className="pagination-container">
            <p className="page-number">
              {startingPageNumber}-{endingPageNumber} of {totalCommentsCount}{" "}
              items
            </p>
            <button
              type="button"
              className="prev-button"
              onClick={this.onClickPreviousPage}
            >
              <FaLessThan className="button-icon" />
            </button>
            <button type="button" className="active-page-number-button">
              {currentPage}
            </button>
            <button
              type="button"
              className={`page-button ${hideNumber}`}
              onClick={this.onClickNext}
            >
              {currentPage + 1}
            </button>
            <button
              type="button"
              className={`prev-button ${hideNumber}`}
              onClick={this.onClickNextPage}
            >
              <FaGreaterThan className="button-icon" />
            </button>
            <select
              className="select-container"
              onChange={this.onChangePageSize}
              value={pageSize}
            >
              <option className="option" value={10}>
                10/Page
              </option>
              <option className="option" value={50}>
                50/Page
              </option>
              <option className="option" value={100}>
                100/Page
              </option>
            </select>
          </div>
        </div>
      </>
    );
  }
}

export default Comments;
