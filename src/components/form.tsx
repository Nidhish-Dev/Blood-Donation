'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
// import Footer from './Footer';

interface FormData {
  firstName: string;
  lastName: string; 
  registrationNumber: string;
  dob: string;
  email: string;
  mobileNumber: string;
  bloodGroup: string;
  lastDonated: string;
  certificate: File | null; 
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
  readMeOpened: boolean; 
}

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '', 
    registrationNumber: '',
    dob: '',
    email: '',
    mobileNumber: '',
    bloodGroup: '',
    lastDonated: '',
    certificate: null, 
    weight: 0,
    height: 0,
    isCancer: false,
    isCardiacProblem: false,
    isBleedingDisorder: false,
    isInfections: false,
    isDiabetes: false,
    isInjectedDrugs: false,
    isWilling: false,
    isHighRiskIndividual: false,
    readMeOpened: false, 
  });

  const [currentStep, setCurrentStep] = useState(1); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const postURL = process.env.NEXT_PUBLIC_POST_URL;
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement; 
    if (type === 'radio') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'yes', 
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, certificate: e.target.files[0] });
    }
  };

  const handleNext = () => {
    const { firstName, registrationNumber, dob, email, mobileNumber, bloodGroup, weight, height } = formData;
    if (firstName && registrationNumber && dob && email && mobileNumber && bloodGroup && weight > 0 && height > 0) {
      setCurrentStep(2); 
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = (formData as any)[key];
      form.append(key, value);
    });

    try {
      const response = await fetch('https://blood-donation-server-sable.vercel.app/api/form/submit', {
        method: 'POST',
        body: form, 
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      alert('Form submitted successfully!');
    } catch (error) {
      alert('Error submitting form!');
    }
  };

  const handleReadMeAlert = () => {
    alert("Please read the High Security Check.");
    setFormData((prev) => ({ ...prev, readMeOpened: true }));
  };

  return (
    <div className='FORMLAYOUT' >
    <div className='donationForm flex flex-col md:flex-row items-center justify-center  gap-3' >
      <div className='imgContainer'>
      <img className='formimg hidden md:block' src="/image 2.jpg" alt="" /> {/* Hide image on mobile screens */}
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full md:w-1/2'> {/* Full width on mobile */}
        {currentStep === 1 && (
          <>
            <p className='heading mt-4 flex'>Name<p className='text-sm text-red-600'>*</p></p>
            <div className='flex flex-col md:flex-row gap-4'>
              <input
                className='short'
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                className='short'
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <p className='heading flex'>Registration Number<p className='text-sm text-red-600'>*</p></p>
            <input
              className='long'
              type="text"
              name="registrationNumber"
              placeholder="RA24.."
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
            <p className='heading'>Mobile Number<p className='text-sm text-red-600'>*</p></p>
            <input
              className='long'
              type="tel"
              name="mobileNumber"
              placeholder="91XXXXXXXXXX"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
            <p className='heading'>SRM Email address<p className='text-sm text-red-600'>*</p></p>
            <input
              className='long'
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className='flex flex-row md:flex-row items-start'> 
              <div> 
                <p className='heading mb-1'>Date Of Birth<p className='text-sm text-red-600'>*</p></p>
                <input
                  className='short placeholder-gray-500' 
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  placeholder="Select Date of Birth" 
                />
              </div>  
              <div>
                <p className='heading ml-1 mb-1'>Height<p className='text-sm text-red-600'>*</p></p>
                <input
                  className='short ml-1 placeholder-gray-500' 
                  type="number"
                  name="height"
                  placeholder="Height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>   
            </div>

            {/* weight and blood group */}
            <div className='flex flex-row  md:flex-row items-center'> 
              <div> 
                <p className='heading mb-1'>Weight<p className='text-sm text-red-600'>*</p></p>
                <input
                  className='short'
                  type="number"
                  name="weight"
                  placeholder="Weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>  
              <div>
                <p className='heading ml-3 mb-1'>Blood Group<p className='text-sm text-red-600'>*</p></p>
                <select
                  className='select ml-3 pr-2'
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>   
            </div>

            {/* last donated and certificate */}
            <div className='flex flex-col md:flex-row'> 
              <div> 
                <p className='heading mb-1'>Last Donated</p>
                <input
                  className='short'
                  type="date"
                  name="lastDonated"
                  value={formData.lastDonated}
                  onChange={handleChange}
                />
              </div>  
              <div>
                <p className='heading ml-3 mb-1'>Certificate</p>
                <div className='flex items-center ml-3 '>
                  <label className="file-input-label cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    Select Certificate
                    <input
                      type="file"
                      name="certificate"
                      onChange={handleFileChange}
                      required
                      className="hidden" /* Hide default file input */
                    />
                  </label>
                </div>
              </div>   
            </div>

            <button className=' nextBtn mb-4' type="button" onClick={handleNext}>Become a Donor</button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className='secondStep flex flex-col justify-around'>
              <h2 className='secondHeading'>Health Security Check</h2>
              <div className="flex flex-col  m-2">

              <div className=''>
              <label className='medicalconditionstext'>Do you have cancer?</label>
              <input
                type="checkbox"
                name="isCancer"
                checked={formData.isCancer}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='medicalconditionstext'>Do you have any cardiac problem?</label>
              <input
                type="checkbox"
                name="isCardiacProblem"
                checked={formData.isCardiacProblem}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='medicalconditionstext'>Suffer any bleeding disorder?</label>
              <input
                type="checkbox"
                name="isBleedingDisorder"
                checked={formData.isBleedingDisorder}
                onChange={handleChange}
              />
            </div>
          
            <div>
              <label className='medicalconditionstext'>Do you have Diabetes on Insulin Injection?</label>
              <input
                type="checkbox"
                name="isDiabetes"
                checked={formData.isDiabetes}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='medicalconditionstext'>Ever injected drugs intravenously?</label>
              <input
                type="checkbox"
                name="isInjectedDrugs"
                checked={formData.isInjectedDrugs}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='medicalconditionstext'>Any infections like Infection, Hepatits B,C, Tuberculosic, Leprosy, HIV?</label>
              <input
                type="checkbox"
                name="isInfections"
                checked={formData.isInfections}
                onChange={handleChange}
              />
            </div>
           
            {/* <div>
              <label className='medicalconditionstext'>Are you a <a> High Risk Individual? </a></label>
              <input
                type="checkbox"
                name="isHighRiskIndividual"
                checked={formData.isHighRiskIndividual }
                onChange={handleChange}
              />
            </div> */}
             <div>
      {/* High Risk Individual Section */}
      <div>
        <label className='medicalconditionstext'>
          Are you a <a onClick={toggleModal} className="cursor-pointer text-blue-500">High Risk Individual?</a>
        </label>
        <input
          type="checkbox"
          name="isHighRiskIndividual"
          // Assuming formData is managed in parent component
          checked={formData.isHighRiskIndividual}
          onChange={handleChange}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  High Risk Individual
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={toggleModal}
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Modal body */}
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                </p>
              </div>

              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={toggleModal}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Close
                </button>
              
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

            {/* <div className='flex items-center'>
              <input
                type="checkbox"
                name="readMeOpened"
                checked={formData.readMeOpened}
                onChange={handleChange}
              />
              <label onClick={handleReadMeAlert} className='cursor-pointer'>I have read the High Security Check</label>
              </div> */}
            </div>
            </div>
            <div className='besaviour '>
              <p className=' ml-4 mt-2 font-medium'>Want to be someone’s saviour?</p>
              <p className='medipara ml-8 m-1'>“Donating blood saves lives by providing essential support to patients in need during surgeries, accidents, and medical treatments. Your contribution can make a vital difference, ensuring that hospitals have the supply needed for emergencies.”</p>

              <div className='text-right mr-4 flex ml-3 mt-2'>
                <div className="flex items-center">
              <input
                type="checkbox"
                name="isWilling"
                checked={formData.isWilling}
                onChange={handleChange}
              />
              <label className='text-sm pl-2 text-gray-700 '>check to say yes!!</label>
              </div>
            </div>
            </div>

            <button className='submitbtn ' type="submit">Submit</button>
          </>
        )}
      </form>
    </div>
    <div className=''>
    {/* <Footer /> */}
    </div>
    </div >
  );
};

export default Form;
