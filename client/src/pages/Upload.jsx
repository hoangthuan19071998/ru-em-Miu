import UploadPage from '../components/UploadPage'; // Component cũ bạn đã có

const Upload = ({ state, actions }) => {
    return (
        <UploadPage
            onUpload={actions.handleFileUpload}
            isUploading={state.isUploading}
        />
    );
};

export default Upload;