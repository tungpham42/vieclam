import React, { useState, useEffect, useCallback, useMemo } from "react";
import { fetchJobs, fetchJobFilters } from "../services/JobService";
import JobCard from "./JobCard";
import JobModal from "./JobModal";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Pagination,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import "./JobBoard.css";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadFilters = useCallback(async () => {
    try {
      const { categories } = await fetchJobFilters();
      setCategories(categories);
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  }, []);

  const loadJobs = useCallback(
    async (page = pagination.currentPage) => {
      setLoading(true);
      try {
        const data = await fetchJobs(searchTerm, page, category, 12);
        setJobs(data.jobs);
        setPagination({ currentPage: page, totalPages: data.totalPages });
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, category, pagination]
  );

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadJobs(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePaginationChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      loadJobs(page);
    }
  };

  const paginationItems = useMemo(() => {
    const delta = 2;
    const startPage = Math.max(1, pagination.currentPage - delta);
    const endPage = Math.min(
      pagination.totalPages,
      pagination.currentPage + delta
    );
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [pagination]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const isPaginationDisabled = jobs.length === 0 || pagination.totalPages === 0;

  return (
    <Container className="my-4">
      <h1 className="text-center">
        <FontAwesomeIcon icon={faBriefcase} /> Remote Job Board
      </h1>
      <Form className="my-4" onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Search for jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Col>
          <Col md={5}>
            <Form.Select
              value={category}
              onChange={handleCategoryChange}
              onKeyDown={handleKeyDown}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
              ) : (
                <FontAwesomeIcon icon={faSearch} />
              )}
              {loading ? "Searching" : " Search"}
            </Button>
          </Col>
        </Row>
      </Form>

      {jobs.length === 0 && !loading && (
        <Alert variant="warning" className="text-center">
          No jobs found. Please try adjusting your search or filters.
        </Alert>
      )}

      <Row>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} openJobModal={setSelectedJob} />
        ))}
      </Row>

      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => handlePaginationChange(1)}
          disabled={isPaginationDisabled || pagination.currentPage === 1}
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </Pagination.First>
        <Pagination.Prev
          onClick={() => handlePaginationChange(pagination.currentPage - 1)}
          disabled={isPaginationDisabled || pagination.currentPage === 1}
        />
        {!isPaginationDisabled &&
          paginationItems.map((page) => (
            <Pagination.Item
              key={page}
              active={page === pagination.currentPage}
              onClick={() => handlePaginationChange(page)}
            >
              {page}
            </Pagination.Item>
          ))}
        <Pagination.Next
          onClick={() => handlePaginationChange(pagination.currentPage + 1)}
          disabled={
            isPaginationDisabled ||
            pagination.currentPage === pagination.totalPages
          }
        />
        <Pagination.Last
          onClick={() => handlePaginationChange(pagination.totalPages)}
          disabled={
            isPaginationDisabled ||
            pagination.currentPage === pagination.totalPages
          }
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </Pagination.Last>
      </Pagination>

      <JobModal
        show={!!selectedJob}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </Container>
  );
};

export default JobBoard;
