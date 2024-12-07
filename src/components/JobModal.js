import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const JobModal = ({ show, job, onClose }) => (
  <Modal show={show} onHide={onClose}>
    {job && (
      <>
        <Modal.Header closeButton>
          <Modal.Title>{job.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Company: {job.company_name}</h5>
          <p>
            <strong>Category:</strong> {job.category}
          </p>
          <p>
            <strong>Salary:</strong> {job.salary || "Not Provided"}
          </p>
          <p>
            <strong>Job description:</strong>
          </p>
          <div dangerouslySetInnerHTML={{ __html: job.description }} />
          <Button
            variant="primary"
            href={`${job.url}?via=tung`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} /> Apply Now
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} /> Close
          </Button>
        </Modal.Footer>
      </>
    )}
  </Modal>
);

export default JobModal;
