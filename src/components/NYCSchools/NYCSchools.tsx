import React, { useState, useEffect} from 'react';
import './NYCSchools.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function NYCSchools() {

    const schoolsEndpoint = `https://data.cityofnewyork.us/resource/s3k6-pzi2.json`;
    const satSchoolsEndpoint = `https://data.cityofnewyork.us/resource/f9bf-2cp4.json`;

    const [schools, setSchools] = useState<any[]>([])
    const [satSchools, setSatSchools] = useState<any[]>([])
    const [sat, setSat] = useState<any[]>([])

    useEffect(() => {
        const getSchools = async () => {
            try {
                const response = await fetch(schoolsEndpoint)
                const data = await response.json()
                setSchools(data)
            } catch(err) {
                console.error(err)
            }
        }
        getSchools();

    }, [schoolsEndpoint])
    // useEffect to get schools

    useEffect(() => {
        const getSatSchools = async () => {
            try {
                const response = await fetch(satSchoolsEndpoint)
                const data = await response.json()
                setSatSchools(data)
            } catch(err) {
                console.error(err)
            }
        }
        getSatSchools();

    }, [satSchoolsEndpoint, satSchools])
    // useEffect to get sat schools

    const handleSat = (e:any) => {
        let updatedSatArr = [...satSchools] 
        updatedSatArr = updatedSatArr.filter( sat => sat.dbn === e)
        setSat(updatedSatArr)
    }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setSat([])
        setShow(false)
    };

    const handleShow = (e:any) => {
        console.log(e.target.className)
        let target = e.target.className
        const schoolId = target.split(' ')
        handleSat(schoolId[0])
        setShow(true)
    };

    return (
        <div className="NYCSchools">
            <div className='schools'>
                <Container><h1>NYC Schools</h1></Container>
                <Container>
                    <Row>
                        {!schools.length ? <p>Loading....</p> : schools.map(({dbn, total_students, school_name, campus_name, language_classes, city, subway, website, overview_paragraph}) => (
                            <Col key={dbn} md={4}>
                                <div className='card-wrapper'>
                                    <div>
                                        <h4>{school_name}</h4>
                                        {campus_name && <p>Campus: {campus_name}</p>}
                                        <p>Total Students: {total_students}</p>
                                    </div>
                                <>
                                    <Button variant="primary" className={dbn} onClick={handleShow}>
                                        View Details
                                    </Button>

                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                        <Modal.Title>{school_name}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className='modal-content'>
                                                <div>Language classes {language_classes}</div>
                                                <div>Overview paragraph: {overview_paragraph}</div>
                                                {sat && <span>SAT Scores - {sat.map(({dbn, num_of_sat_test_takers, sat_critical_reading_avg_score, sat_math_avg_score, sat_writing_avg_score}) => (
                                                <div key={dbn}>
                                                    Number of SAT Test takers: {num_of_sat_test_takers}<br />
                                                    SAT critical reading avg score: {sat_critical_reading_avg_score}<br />
                                                    SAT math avg score: {sat_math_avg_score}
                                                </div>
                                                ))}</span> }
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default NYCSchools;
