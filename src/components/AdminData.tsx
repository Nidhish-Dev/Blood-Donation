'use client'
import React, { useEffect, useState } from 'react';

interface FormData {
  _id: string;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  dob: string;
  email: string;
  mobileNumber: number;
  bloodGroup: string;
  lastDonated: string;
  certificate: string;
  weight: number;
  height: number;
  isCancer: boolean;
  isCardiacProblem: boolean;
  isBleedingDisorder: boolean;
  isInfections: boolean;
  isDiabetes: boolean;
  isInjectedDrugs: boolean;
  isWilling: boolean;
  isHighRiskIndividual: boolean;
  createdAt: string;
  updatedAt: string;
}

function AdminData() {
  const [formData, setFormData] = useState<FormData[]>([]);
  const [filteredData, setFilteredData] = useState<FormData[]>([]);
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);
  const [willingToDonate, setWillingToDonate] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://blood-donation-server-sable.vercel.app/api/form');
        const data = await response.json();
        setFormData(data);
        setFilteredData(data); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleFilter = () => {
    let filtered = formData;

    if (bloodGroupFilter) {
      filtered = filtered.filter((data) => data.bloodGroup === bloodGroupFilter);
    }

    if (ageRange) {
      filtered = filtered.filter(
        (data) => {
          const age = calculateAge(data.dob);
          return age >= ageRange[0] && age <= ageRange[1];
        }
      );
    }

    if (willingToDonate !== null) {
      filtered = filtered.filter((data) => data.isWilling === willingToDonate);
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [bloodGroupFilter, ageRange, willingToDonate]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3>Filter Options</h3>
        <div>
          <label>Blood Group:</label>
          <select onChange={(e) => setBloodGroupFilter(e.target.value)} value={bloodGroupFilter}>
            <option value="">All</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div>
          <label>Age Range: {ageRange[0]} - {ageRange[1]}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={ageRange[0]}
            onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={ageRange[1]}
            onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
          />
        </div>

        <div>
          <label>Willing to Donate:</label>
          <select onChange={(e) => setWillingToDonate(e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null)}>
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div style={styles.cardContainer}>
        {filteredData.length ? (
          filteredData.map((data) => (
            <div key={data._id} style={styles.card}>
              <div style={styles.imageContainer}>
                <img
                  src={data.certificate}
                  alt="Certificate"
                  style={styles.image}
                  onClick={() => window.open(data.certificate, '_blank')}
                />
              </div>
              <p className='text-center text-sm mb-4'>Click on image to Zoom</p>
              <div style={styles.detailsContainer}>
                <div style={styles.leftColumn}>
                  <p><strong>First Name:</strong> {data.firstName}</p>
                  <p><strong>Last Name:</strong> {data.lastName}</p>
                  <p><strong>Registration Number:</strong> {data.registrationNumber}</p>
                  <p><strong>Date of Birth:</strong> {new Date(data.dob).toLocaleDateString()}</p>
                  <p><strong>Age:</strong> {calculateAge(data.dob)} years</p>
                  <p><strong>Email:</strong> {data.email}</p>
                  <p><strong>Mobile:</strong> {data.mobileNumber}</p>
                </div>
                <div style={styles.rightColumn}>
                  <p><strong>Blood Group:</strong> {data.bloodGroup}</p>
                  <p><strong>Last Donated:</strong> {new Date(data.lastDonated).toLocaleDateString()}</p>
                  <p><strong>Weight:</strong> {data.weight} kg</p>
                  <p><strong>Height:</strong> {data.height} cm</p>
                  <p><strong>Willing to Donate:</strong> {data.isWilling ? 'Yes' : 'No'}</p>
                  <p><strong>High-Risk:</strong> {data.isHighRiskIndividual ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No results for this filter.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
  },
  sidebar: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRight: '1px solid #ddd',
  },
  cardContainer: {
    flex: 1,
    padding: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    marginBottom: '20px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  image: {
    maxWidth: '200px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  detailsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    flex: 1,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    flex: 1,
  },
};

export default AdminData;
