import './CreateWorkShiftModal.css';

interface CreateWorkShiftModalProps {
  closeWorkShiftModal: () => void;
}

const CreateWorkShiftModal = ({ closeWorkShiftModal }: CreateWorkShiftModalProps) => {
    const submitCreateWorkShift = (e: React.FormEvent) => {
        e.preventDefault();
    }

    return(
        <div className="create-work-shift-modal">
            <h2 className="create-work-shift-modal-title">Создание новой смены</h2>
            <form className="create-work-shift-modal-form" onSubmit={submitCreateWorkShift}>
                <label className="create-work-shift-modal-label">
                    Время начала смены:&nbsp;
                    <input 
                        type="time" 
                        className="create-work-shift-modal-input" 
                        id="startTime"
                    />
                </label>
                <label className="create-work-shift-modal-label">
                    Время окончания смены:&nbsp;
                    <input 
                        type="time" 
                        className="create-work-shift-modal-input"
                        id="endTime" 
                    />
                </label>
                <label className="create-work-shift-modal-label">
                    Цех:&nbsp;
                    <input 
                        type="text" 
                        className="create-work-shift-modal-input"
                        id="workshop" 
                    />
                </label>
                <label className="create-work-shift-modal-label">
                    Оператор:&nbsp;
                    <input 
                        type="text" 
                        className="create-work-shift-modal-input"
                        id="operator" 
                    />
                </label>
                <div className="create-work-shift-modal-buttons">
                    <button type="button" onClick={closeWorkShiftModal} className="create-work-shift-modal-button create-work-shift-modal-button--cancel">Отмена</button>
                    <button type="submit" className="create-work-shift-modal-button create-work-shift-modal-button--create">Создать</button>
                </div>
            </form>
        </div>
    );
}

export default CreateWorkShiftModal;