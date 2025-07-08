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
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ commentsList: data });
  };

  onChangePageSize = (event) => {
    this.setState(
      {
        pageSize: parseInt(event.target.value),
      },
      this.saveState
    );
  };

  getPaginatedCommentsList = (finalList) => {
    const { currentPage, pageSize } = this.state;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return finalList.slice(startIndex, endIndex);
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
    return comments.filter((each) => {
      const name = each.name.toLowerCase();
      const email = each.email.toLowerCase();
      const body = each.body.toLowerCase();
      return (
        name.includes(searchInput) ||
        email.includes(searchInput) ||
        body.includes(searchInput)
      );
    });
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

  ascendingOrder = (list) => list.sort((a, b) => a.postId - b.postId);
  descendingOrder = (list) => list.sort((a, b) => b.postId - a.postId);

  postBasedComments = (list) => {
    const { sortingOrder } = this.state;
    switch (sortingOrder) {
      case "ASC":
        return this.ascendingOrder(list);
      case "DESC":
        return this.descendingOrder(list);
      case null:
      default:
        return list;
    }
  };

  getAscending = (col, list) =>
    list.sort((a, b) => a[col].localeCompare(b[col]));
  getDescending = (col, list) =>
    list.sort((a, b) => b[col].localeCompare(a[col]));

  stringBasedComments = (col, list) => {
    const { sortingOrder } = this.state;
    switch (sortingOrder) {
      case "ASC":
        return this.getAscending(col, list);
      case "DESC":
        return this.getDescending(col, list);
      case null:
      default:
        return list;
    }
  };

  getSortBasedComment = (list) => {
    const { sortByColumnName } = this.state;
    if (sortByColumnName === "postId") {
      return this.postBasedComments(list);
    } else if (sortByColumnName === "name") {
      return this.stringBasedComments("name", list);
    } else if (sortByColumnName === "email") {
      return this.stringBasedComments("email", list);
    }
    return list;
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

    if (commentsList.length === 0) {
      return (
        <div className="loader-container">
          <TailSpin color="#0b69ff" height="50" width="50" />
        </div>
      );
    }

    const searchBasedComments = this.getSearchBasedComments(commentsList);
    const sortBasedComments = this.getSortBasedComment(searchBasedComments);
    const paginatedComments = this.getPaginatedCommentsList(sortBasedComments);

    const totalCommentsCount = sortBasedComments.length;
    const startingPageNumber = (currentPage - 1) * pageSize + 1;
    let endingPageNumber = currentPage * pageSize;
    if (endingPageNumber > totalCommentsCount) {
      endingPageNumber = totalCommentsCount;
    }

    const hideNumber = currentPage * pageSize >= 500 ? "hide" : null;

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

            {paginatedComments.map((each) => (
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
              onClick={this.onClickNextPage}
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
