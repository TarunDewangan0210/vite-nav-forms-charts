import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CheckIn } from '../types';
import './EditCheckInModal.css';

interface EditCheckInModalProps {
  checkIn: CheckIn;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCheckIn: CheckIn) => void;
}

interface FormData {
  name: string;
  date: string;
  activitiesSince: string;
  activitiesPlanned: string;
  blockers: string;
  stressLevel: number;
  whyStressed?: string;
  moraleLevel: number;
}

const EditCheckInModal: React.FC<EditCheckInModalProps> = ({
  checkIn,
  isOpen,
  onClose,
  onSave
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: checkIn.name,
      date: checkIn.date,
      activitiesSince: checkIn.activitiesSince,
      activitiesPlanned: checkIn.activitiesPlanned,
      blockers: checkIn.blockers,
      stressLevel: checkIn.stressLevel,
      whyStressed: checkIn.whyStressed || '',
      moraleLevel: checkIn.moraleLevel
    }
  });

  const stressLevel = watch('stressLevel');

  useEffect(() => {
    if (isOpen) {
      reset({
        name: checkIn.name,
        date: checkIn.date,
        activitiesSince: checkIn.activitiesSince,
        activitiesPlanned: checkIn.activitiesPlanned,
        blockers: checkIn.blockers,
        stressLevel: checkIn.stressLevel,
        whyStressed: checkIn.whyStressed || '',
        moraleLevel: checkIn.moraleLevel
      });
    }
  }, [checkIn, isOpen, reset]);

  const onSubmit = (data: FormData) => {
    const updatedCheckIn: CheckIn = {
      ...checkIn,
      ...data,
      whyStressed: data.stressLevel === 5 ? data.whyStressed : undefined
    };
    onSave(updatedCheckIn);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Check-in</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && <span className="error-message">{errors.date.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="activitiesSince">Activities Since Last Check-in *</label>
            <textarea
              id="activitiesSince"
              rows={3}
              {...register('activitiesSince', { required: 'Activities since is required' })}
              className={errors.activitiesSince ? 'error' : ''}
            />
            {errors.activitiesSince && <span className="error-message">{errors.activitiesSince.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="activitiesPlanned">Activities Planned *</label>
            <textarea
              id="activitiesPlanned"
              rows={3}
              {...register('activitiesPlanned', { required: 'Activities planned is required' })}
              className={errors.activitiesPlanned ? 'error' : ''}
            />
            {errors.activitiesPlanned && <span className="error-message">{errors.activitiesPlanned.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="blockers">Blockers</label>
            <textarea
              id="blockers"
              rows={2}
              {...register('blockers')}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stressLevel">Stress Level (1-5) *</label>
              <select
                id="stressLevel"
                {...register('stressLevel', { 
                  required: 'Stress level is required',
                  valueAsNumber: true 
                })}
                className={errors.stressLevel ? 'error' : ''}
              >
                <option value="">Select level</option>
                <option value={1}>1 - Very Low</option>
                <option value={2}>2 - Low</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - High</option>
                <option value={5}>5 - Very High</option>
              </select>
              {errors.stressLevel && <span className="error-message">{errors.stressLevel.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="moraleLevel">Morale Level (1-5) *</label>
              <select
                id="moraleLevel"
                {...register('moraleLevel', { 
                  required: 'Morale level is required',
                  valueAsNumber: true 
                })}
                className={errors.moraleLevel ? 'error' : ''}
              >
                <option value="">Select level</option>
                <option value={1}>1 - Very Low</option>
                <option value={2}>2 - Low</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - High</option>
                <option value={5}>5 - Very High</option>
              </select>
              {errors.moraleLevel && <span className="error-message">{errors.moraleLevel.message}</span>}
            </div>
          </div>

          {stressLevel === 5 && (
            <div className="form-group">
              <label htmlFor="whyStressed">Why are you stressed? *</label>
              <textarea
                id="whyStressed"
                rows={2}
                {...register('whyStressed', { 
                  required: stressLevel === 5 ? 'Please explain why you are stressed' : false 
                })}
                className={errors.whyStressed ? 'error' : ''}
              />
              {errors.whyStressed && <span className="error-message">{errors.whyStressed.message}</span>}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCheckInModal; 