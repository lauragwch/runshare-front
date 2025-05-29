import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contextes/AuthContext';
import { runService } from '../Services/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Styles/Pages/CreateRunPage.css';

const CreateRunPage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    distance: '',
    level: 'débutant',
    is_private: false
  });
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Générer les créneaux horaires par tranches de 15 minutes
  const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push(timeString);
      }
    }
    return timeSlots;
  };
  
  const timeSlots = generateTimeSlots();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Réinitialiser l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    updateFormDateTime(date, selectedTime);
  };
  
  const handleTimeChange = (e) => {
    const time = e.target.value;
    setSelectedTime(time);
    updateFormDateTime(selectedDate, time);
  };
  
  const updateFormDateTime = (date, time) => {
    if (date && time) {
      const [hours, minutes] = time.split(':');
      const dateTime = new Date(date);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      setFormData(prev => ({
        ...prev,
        date: dateTime.toISOString()
      }));
    }
  };
  
  const formatDisplayDate = () => {
    if (!selectedDate) return 'Sélectionnez une date';
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    let display = selectedDate.toLocaleDateString('fr-FR', options);
    if (selectedTime) {
      display += ` à ${selectedTime}`;
    }
    
    return display;
  };
  
  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date();
    
    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }
    
    if (!selectedDate) {
      newErrors.date = "La date est requise";
    } else if (!selectedTime) {
      newErrors.date = "L'heure est requise";
    } else {
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (selectedDateTime <= currentDate) {
        newErrors.date = "La date et l'heure doivent être dans le futur";
      }
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Le lieu est requis";
    }
    
    if (formData.distance && (isNaN(formData.distance) || parseFloat(formData.distance) <= 0)) {
      newErrors.distance = "Distance invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const response = await runService.create(formData);
      
      // Redirection vers la page de détail de la nouvelle course
      navigate(`/runs/${response.data.id_run}`);
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || "Une erreur est survenue lors de la création de la course"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Désactiver les dates passées
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return false;
  };
  
  return (
    <div className="createRunPage">
      <div className="createRunContainer">
        <h1>Organiser une course</h1>
        
        {errors.form && <div className="formError">{errors.form}</div>}
        
        <form onSubmit={handleSubmit} className="createRunForm">
          <div className="formSection">
            <h2>Informations générales</h2>
            
            <div className="formGroup">
              <label htmlFor="title">Titre de la course*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Course matinale au parc"
              />
              {errors.title && <div className="fieldError">{errors.title}</div>}
            </div>
            
            <div className="formGroup">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre parcours et le type d'ambiance recherchée"
                rows="4"
              />
            </div>
          </div>
          
          <div className="formSection">
            <h2>Date et lieu</h2>
            
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="date">Date et heure*</label>
                <div className="modernDateTimeSelector">
                  <div 
                    className="dateTimeDisplay"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <i className="fa-regular fa-calendar-alt"></i>
                    <span>{formatDisplayDate()}</span>
                    <i className={`fa-solid fa-chevron-${showCalendar ? 'up' : 'down'}`}></i>
                  </div>
                  
                  {showCalendar && (
                    <div className="calendarDropdown">
                      <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        locale="fr-FR"
                        tileDisabled={tileDisabled}
                        className="modernCalendar"
                        formatShortWeekday={(locale, date) => {
                          const weekdays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
                          return weekdays[date.getDay()];
                        }}
                      />
                    </div>
                  )}
                  
                  {selectedDate && (
                    <div className="timeSelector">
                      <label htmlFor="time">Heure*</label>
                      <select
                        id="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="timeSelect"
                      >
                        <option value="">Choisir une heure</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="fieldHelper">Créneaux disponibles de 6h00 à 21h45 par tranches de 15 min</div>
                {errors.date && <div className="fieldError">{errors.date}</div>}
              </div>
              
              <div className="formGroup">
                <label htmlFor="location">Lieu*</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Parc de la Tête d'Or, Lyon"
                />
                {errors.location && <div className="fieldError">{errors.location}</div>}
              </div>
            </div>
          </div>
          
          <div className="formSection">
            <h2>Détails techniques</h2>
            
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="distance">Distance (km)</label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="Ex: 5"
                />
                {errors.distance && <div className="fieldError">{errors.distance}</div>}
              </div>
              
              <div className="formGroup">
                <label htmlFor="level">Niveau</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="débutant">Débutant</option>
                  <option value="intermédiaire">Intermédiaire</option>
                  <option value="avancé">Avancé</option>
                </select>
              </div>
            </div>
            
            <div className="formGroup checkboxGroup">
              <input
                type="checkbox"
                id="is_private"
                name="is_private"
                checked={formData.is_private}
                onChange={handleChange}
              />
              <label htmlFor="is_private">Course privée (sur invitation uniquement)</label>
            </div>
          </div>
          
          <div className="formActions">
            <button 
              type="button" 
              className="cancelBtn"
              onClick={() => navigate('/runs')}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submitBtn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création...' : 'Créer la course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRunPage;