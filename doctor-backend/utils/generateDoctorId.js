function generateDoctorId() {
  const random = Math.floor(1e12 + Math.random() * 9e12); 
  return random.toString(); 
}


module.exports = generateDoctorId;
