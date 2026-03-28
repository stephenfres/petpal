import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, PawPrint } from 'lucide-react';

export const PetCard = ({ pet, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const getGenderIcon = (gender) => {
    if (gender === 'male') return '♂️';
    if (gender === 'female') return '♀️';
    return '';
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return t('pets.ageUnknown', '? years');
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 1) {
      const months = Math.floor(monthDiff < 0 ? 12 + monthDiff : monthDiff);
      return `${months} ${t('pets.months', 'months')}`;
    }
    return `${age} ${t('pets.years', 'years')}`;
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit && typeof onEdit === 'function') {
      onEdit(pet);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && typeof onDelete === 'function') {
      onDelete(pet.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center">
        {pet.imageUrl ? (
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
        ) : (
          <PawPrint className="h-16 w-16 text-white/80" />
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
              title={t('common.edit', 'Edit')}
              aria-label="Edit pet"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title={t('common.delete', 'Delete')}
              aria-label="Delete pet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          {t(`pets.types.${pet.type}`, pet.type)} {getGenderIcon(pet.gender)}
        </p>
        
        {pet.breed && (
          <p className="text-xs text-gray-500 mb-1">
            {pet.breed}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>{getAge(pet.dateOfBirth)}</span>
          {pet.weight?.value && (
            <span>{pet.weight.value} {pet.weight.unit}</span>
          )}
        </div>
        
        <Link
          to={`/pets/${pet.id}`}
          className="mt-3 block text-center text-teal-600 text-sm font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {t('pets.viewDetails', 'View Details')}
        </Link>
      </div>
    </div>
  );
};