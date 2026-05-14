import React from 'react';
import { AppModal } from '../custom/AppModal';
import { Dish } from '../interactive/dishes';
// eslint-disable-next-line import/no-named-as-default
import DishEditCreateForm from '../forms/dishEditCreateForm';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DishFormModalProps {
    visible: boolean;
    onClose: () => void;
    defaultValues?: Partial<Dish>;
    onSubmit: (dish: Omit<Dish, 'id'>) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

// ─── DishFormModal ────────────────────────────────────────────────────────────

export const DishFormModal: React.FC<DishFormModalProps> = ({
    visible,
    onClose,
    defaultValues,
    onSubmit,
    submitLabel = 'Save Item',
    isSubmitting = false,
}) => (
    <AppModal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
        modalTitle={defaultValues?.id ? 'Edit Item' : 'New Item'}
    >
        <DishEditCreateForm
            defaultValues={defaultValues}
            onSubmit={(dish) => {
                onSubmit(dish);
                onClose();
            }}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
        />
    </AppModal>
);

export default DishFormModal;