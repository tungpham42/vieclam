import React, { useState, useEffect, useCallback } from "react";
import { fetchJobs, fetchJobFilters } from "../services/JobService";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Pagination,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faLink,
  faTimes,
  faExternalLinkAlt,
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (inputDate) => {
    const date = new Date(inputDate);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24-hour format
    };
    const formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDateTime;
  };

  const loadFilters = useCallback(async () => {
    try {
      const { categories } = await fetchJobFilters();
      setCategories(categories);
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  }, []);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchJobs(searchTerm, page, category, 12);
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, category]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset to first page
  };

  const handlePagination = (selectedPage) => {
    if (selectedPage >= 1 && selectedPage <= totalPages) {
      setPage(selectedPage);
    }
  };

  const openJobModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeJobModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const getPaginationItems = () => {
    const pageNumbers = [];
    const delta = 2;
    const startPage = Math.max(1, page - delta);
    const endPage = Math.min(totalPages, page + delta);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <Container className="my-4">
      <h1 className="text-center">
        <FontAwesomeIcon icon={faBriefcase} /> Remote Job Board
      </h1>

      <Form className="my-4">
        <Row>
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Search for jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={5}>
            <Form.Select value={category} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button
              variant="primary"
              onClick={() => loadJobs()}
              disabled={loading}
            >
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

      {jobs.length === 0 && (
        <Alert variant="warning" className="text-center">
          No jobs found. Please try adjusting your search or filters.
        </Alert>
      )}

      <Row>
        {jobs.map((job) => (
          <Col key={job.id} md={4} sm={6} className="mb-4">
            <Card className="job-card h-100 shadow-lg">
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {job.company_logo && (
                    <img
                      src={job.company_logo}
                      alt={job.company_name}
                      style={{ width: 40, height: 40, borderRadius: "50%" }}
                      className="me-2"
                    />
                  )}
                  {job.company_name}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Salary:</strong>{" "}
                  {job.salary ? `${job.salary}` : "Not Provided"}
                </Card.Text>
                <Card.Text>
                  <strong>Published:</strong>{" "}
                  {formatDateTime(job.publication_date)
                    ? `${formatDateTime(job.publication_date)}`
                    : "Not Provided"}
                </Card.Text>
                <Button variant="primary" onClick={() => openJobModal(job)}>
                  <FontAwesomeIcon icon={faLink} /> View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center">
        <Pagination.First
          onClick={() => handlePagination(1)}
          disabled={page === 1}
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </Pagination.First>
        <Pagination.Prev
          onClick={() => handlePagination(page - 1)}
          disabled={page === 1}
        />
        {getPaginationItems().map((pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === page}
            onClick={() => handlePagination(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePagination(page + 1)}
          disabled={page === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePagination(totalPages)}
          disabled={page === totalPages}
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </Pagination.Last>
      </Pagination>

      {selectedJob && (
        <Modal show={showModal} onHide={closeJobModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedJob.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Company: {selectedJob.company_name}</h5>
            <p>
              <strong>Category:</strong> {selectedJob.category}
            </p>
            <p>
              <strong>Salary:</strong>{" "}
              {selectedJob.salary ? `${selectedJob.salary}` : "Not Provided"}
            </p>
            <p>
              <strong>Job description:</strong>{" "}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedJob.description }}
            />
            <Button
              variant="primary"
              href={`${selectedJob.url}?via=tung`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} /> Apply Now
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeJobModal}>
              <FontAwesomeIcon icon={faTimes} /> Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default JobBoard;
