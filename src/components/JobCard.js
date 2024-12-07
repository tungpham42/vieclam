import { Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const formatDateTime = (inputDate) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(inputDate));

const JobCard = ({ job, openJobModal }) => (
  <Col md={4} sm={6} className="mb-4">
    <Card className="job-card h-100 shadow-lg">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {job.company_logo && (
            <img
              src={job.company_logo}
              alt={job.company_name}
              className="me-2"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          )}
          {job.company_name}
        </Card.Subtitle>
        <Card.Text>
          <strong>Salary:</strong> {job.salary || "Not Provided"}
        </Card.Text>
        <Card.Text>
          <strong>Published:</strong> {formatDateTime(job.publication_date)}
        </Card.Text>
        <Button variant="primary" onClick={() => openJobModal(job)}>
          <FontAwesomeIcon icon={faLink} /> View Details
        </Button>
      </Card.Body>
    </Card>
  </Col>
);

export default JobCard;
