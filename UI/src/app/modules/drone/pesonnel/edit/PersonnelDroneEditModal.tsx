import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { toast } from 'react-toastify'
import { FileUploader } from 'react-drag-drop-files'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { provinces, districts } from 'helpers/provincesAndDistrictsJson'
import image from '_metronic/assets/images/user_male.png'
import { t } from 'i18next'
import { Modal } from 'react-bootstrap'
import { countries } from 'helpers/countries'
import Select from 'react-select'
import { updatePersonnelDroneBoss, viewPersonnelCameraBoss } from 'redux/drone/personnel/PersonnelDroneCameraSlice'

interface Props {
    showModal: boolean
    setShowModal: (show: boolean) => void
    personnelId: number
    onSuccess: () => void
}

const PersonnelDroneEditModal = ({
    showModal,
    setShowModal,
    personnelId,
    onSuccess
}: Props) => {

    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState<File | null>(null)
    const [files, setFiles] = useState<File[]>([])
    const [selectedDistricts, setSelectedDistricts] = useState<any[]>([])
    const [selectedCurrentDistricts, setSelectedCurrentDistricts] = useState<any[]>([])
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const defaultImage = image

    const FormSchema = Yup.object().shape({
        name_dr: Yup.string().required(t('global.is_required')),
        name_en: Yup.string().required(t('global.is_required')),
        last_name_dr: Yup.string().required(t('global.is_required')),
        last_name_en: Yup.string().required(t('global.is_required')),
        f_name_da: Yup.string().required(t('global.is_required')),
        phone: Yup.string().required(t('global.is_required')),
        passport_no: Yup.string().required(t('global.is_required')),
        country: Yup.string().required(t('global.is_required')),
    })

    const formik = useFormik({
        initialValues: {
            id: '',
            name_dr: '',
            name_en: '',
            last_name_dr: '',
            last_name_en: '',
            f_name_da: '',
            phone: '',
            job: '',
            email: '',
            passport_no: '',
            country: '',
            main_province: '',
            main_district: '',
            main_village: '',
            current_province: '',
            current_district: '',
            current_village: '',
            type_residence_info: '',
        },
        validationSchema: FormSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {

            setLoading(true)
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, String(value ?? ''))
            })

            if (photo) {
                formData.append('photo', photo)
            }

            files.forEach((file) => {
                formData.append('attachments[]', file)
            })

            const response = await dispatch(updatePersonnelDroneBoss({
                id: personnelId,
                formData
            }))

            if (response?.meta?.requestStatus === 'fulfilled') {
                toast.success(t('personnelDroneCamera.toast_update'))
                onSuccess()
                setShowModal(false)
            } else {
                toast.error(t('personnelDroneCamera.toast_error'))
            }

            setLoading(false)
        }
    })

    // LOAD DATA
    useEffect(() => {
        if (!showModal || !personnelId) return

        dispatch(viewPersonnelCameraBoss({ id: personnelId }))
            .unwrap()
            .then((record) => {
                if (!record) return

                formik.setValues({
                    id: record.id,
                    name_dr: record.name_dr || '',
                    name_en: record.name_en || '',
                    last_name_dr: record.last_name_dr || '',
                    last_name_en: record.last_name_en || '',
                    f_name_da: record.f_name_da || '',
                    phone: record.phone || '',
                    email: record.email || '',
                    job: record.job || '',
                    passport_no: record.passport_no || '',
                    country: record.country || '',
                    main_province: record.main_province || '',
                    main_district: record.main_district || '',
                    main_village: record.main_village || '',
                    current_province: record.current_province || '',
                    current_district: record.current_district || '',
                    current_village: record.current_village || '',
                    type_residence_info: record.type_residence_info || '',
                })

                if (record.photo) {
                    setImagePreview(record.photo)
                }

                if (record.main_province) {
                    const filtered = districts.filter(
                        (d) => String(d.provincecode) === String(record.main_province)
                    )
                    setSelectedDistricts(filtered)
                }

                if (record.current_province) {
                    const filtered = districts.filter(
                        (d) => String(d.provincecode) === String(record.current_province)
                    )
                    setSelectedCurrentDistricts(filtered)
                }
            })
    }, [showModal, personnelId])

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        if (file) {
            setPhoto(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleProvinceChange = (provinceId: string) => {
        const filtered = districts.filter(
            d => String(d.provincecode) === provinceId
        )
        setSelectedDistricts(filtered)
        formik.setFieldValue('main_district', '')
    }

    const handleCurrentProvinceChange = (provinceId: string) => {
        const filtered = districts.filter(
            d => String(d.provincecode) === provinceId
        )
        setSelectedCurrentDistricts(filtered)
        formik.setFieldValue('current_district', '')
    }

    const handleDrop = (newFiles: File[]) => {
        setFiles([...files, ...newFiles])
    }

    const handleFileRemove = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size='xl' backdrop='static'>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h1 className='fw-bolder'>
                        <i className='fas fa-edit text-primary'></i> {t('personnelDroneCamera.edit_personnel')}
                    </h1>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className='col-md-12'>
                    <form onSubmit={formik.handleSubmit}>
                        <div className='col-md-12'>
                            <form onSubmit={formik.handleSubmit}>
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <label htmlFor='name_dr'>{t('boss.name_dr')}</label>
                                            <input
                                                id='name_dr'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('name_dr')}
                                            />
                                            {formik.errors.name_dr && formik.touched.name_dr && (
                                                <div className='text-danger'>{formik.errors.name_dr}</div>
                                            )}
                                            <label htmlFor='last_name_dr' className='mt-4'>{t('boss.last_name_dr')}</label>
                                            <input
                                                id='last_name_dr'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('last_name_dr')}
                                            />
                                            {formik.errors.last_name_dr && formik.touched.last_name_dr && (
                                                <div className='text-danger'>{formik.errors.last_name_dr}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <label htmlFor='name_en'>{t('boss.name_en')}</label>
                                            <input
                                                id='name_en'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('name_en')}
                                            />
                                            {formik.errors.name_en && formik.touched.name_en && (
                                                <div className='text-danger'>{formik.errors.name_en}</div>
                                            )}
                                            <label htmlFor='last_name_en' className='mt-4'>
                                                {t('boss.last_name_en')}
                                            </label>
                                            <input
                                                id='last_name_en'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('last_name_en')}
                                            />
                                            {formik.errors.last_name_en && formik.touched.last_name_en && (
                                                <div className='text-danger'>{formik.errors.last_name_en}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <label htmlFor='f_name_da' >
                                                {t('boss.f_name_da')}
                                            </label>
                                            <input
                                                id='f_name_da'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('f_name_da')}
                                            />
                                            {formik.errors.f_name_da && formik.touched.f_name_da && (
                                                <div className='text-danger'>{formik.errors.f_name_da}</div>
                                            )}

                                            <label htmlFor='email' className='mt-4'>
                                                {t('boss.email')}
                                            </label>
                                            <input
                                                id='email'
                                                type='email'
                                                className='form-control'
                                                {...formik.getFieldProps('email')}
                                            />
                                            {formik.errors.email && formik.touched.email && (
                                                <div className='text-danger'>{formik.errors.email}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-2 mx-6'>
                                        <div className='form-group'>
                                            <label htmlFor='photo'>{t('boss.photo')}</label>
                                            <br />
                                            <input
                                                id='photo'
                                                name='photo'
                                                type='file'
                                                hidden
                                                accept='image/png, image/jpeg'
                                                onChange={handleImageChange}
                                                ref={fileInputRef}
                                            />
                                            <img
                                                src={imagePreview || defaultImage}
                                                className='img-fluid img-thumbnail'
                                                alt='user-logo'
                                                style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                                                onClick={() => fileInputRef.current?.click()}
                                            />
                                        </div>
                                    </div>


                                </div>
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <label htmlFor='phone'>{t('boss.phone')}</label>
                                            <input
                                                id='phone'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('phone')}
                                            />
                                            {formik.errors.phone && formik.touched.phone && (
                                                <div className='text-danger'>{formik.errors.phone}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <label htmlFor='passport_no'>{t('boss.passport_no')}</label>
                                            <input
                                                id='passport_no'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('passport_no')}
                                            />
                                            {formik.errors.passport_no && formik.touched.passport_no && (
                                                <div className='text-danger'>{formik.errors.passport_no}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <label htmlFor='job'>{t('boss.job')}</label>
                                            <input
                                                id='job'
                                                type='text'
                                                className='form-control'
                                                {...formik.getFieldProps('job')}
                                            />
                                            {formik.errors.job && formik.touched.job && (
                                                <div className='text-danger'>{formik.errors.job}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='form-group'>
                                            <label htmlFor='country'>{t('boss.country')}</label>
                                            <Select
                                                id='country'
                                                className='react-select-container'
                                                styles={{
                                                    control: (base) => ({ ...base, minHeight: '45px', height: '45px' }),
                                                }}
                                                classNamePrefix='react-select'
                                                options={[
                                                    { value: '', label: t('boss.select_country') },
                                                    ...countries.map((country) => ({
                                                        value: country,
                                                        label: country,
                                                    })),
                                                ]}
                                                value={
                                                    formik.values.country
                                                        ? { value: formik.values.country, label: formik.values.country }
                                                        : { value: '', label: t('boss.select_country') }
                                                }
                                                onChange={(selectedOption) => {
                                                    formik.setFieldValue('country', selectedOption?.value || '')
                                                    // Reset province and district when country changes
                                                    formik.setFieldValue('main_province', '')
                                                    formik.setFieldValue('main_district', '')
                                                    formik.setFieldValue('main_village', '')
                                                    formik.setFieldValue('current_province', '')
                                                    formik.setFieldValue('current_district', '')
                                                    formik.setFieldValue('current_village', '')
                                                    formik.setFieldValue('type_residence_info', '')
                                                }}
                                                name='country'
                                            />
                                        </div>
                                    </div>
                                </div>
                                {formik.values.country && (
                                    <>
                                        {formik.values.country === 'Afghanistan' ||
                                            formik.values.country === 'افغانستان' ? (
                                            <>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='form-group'>
                                                            <label htmlFor='main_province'>{t('boss.main_province')}</label>
                                                            <select
                                                                id='main_province'
                                                                className='form-control'
                                                                {...formik.getFieldProps('main_province')}
                                                                onChange={(e) => {
                                                                    formik.handleChange(e)
                                                                    handleProvinceChange(e.target.value)
                                                                }}
                                                            >
                                                                <option value=''>{t('boss.select_province')}</option>
                                                                {provinces.map((province) => (
                                                                    <option key={province.value} value={province.value}>
                                                                        {province.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formik.errors.main_province && formik.touched.main_province && (
                                                                <div className='text-danger'>{formik.errors.main_province}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='form-group'>
                                                            <label htmlFor='main_district'>{t('boss.main_district')}</label>
                                                            <select
                                                                id='main_district'
                                                                className='form-control'
                                                                {...formik.getFieldProps('main_district')}
                                                            >
                                                                <option value=''>{t('boss.select_district')}</option>
                                                                {selectedDistricts.map((district) => (
                                                                    <option key={district.value} value={district.value}>
                                                                        {district.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formik.errors.main_district && formik.touched.main_district && (
                                                                <div className='text-danger'>{formik.errors.main_district}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='form-group'>
                                                            <label htmlFor='main_village'>{t('boss.main_village')}</label>
                                                            <input
                                                                id='main_village'
                                                                type='text'
                                                                className='form-control'
                                                                {...formik.getFieldProps('main_village')}
                                                            />
                                                            {formik.errors.main_village && formik.touched.main_village && (
                                                                <div className='text-danger'>{formik.errors.main_village}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='form-group'>
                                                            <label htmlFor='current_province'>{t('boss.current_province')}</label>
                                                            <select
                                                                id='current_province'
                                                                className='form-control'
                                                                {...formik.getFieldProps('current_province')}
                                                                onChange={(e) => {
                                                                    formik.handleChange(e)
                                                                    handleCurrentProvinceChange(e.target.value)
                                                                }}
                                                            >
                                                                <option value=''>{t('boss.select_province')}</option>
                                                                {provinces.map((province) => (
                                                                    <option key={province.value} value={province.value}>
                                                                        {province.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formik.errors.current_province && formik.touched.current_province && (
                                                                <div className='text-danger'>{formik.errors.current_province}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='form-group'>
                                                            <label htmlFor='current_district'>{t('boss.current_district')}</label>
                                                            <select
                                                                id='current_district'
                                                                className='form-control'
                                                                {...formik.getFieldProps('current_district')}
                                                            >
                                                                <option value=''>{t('boss.select_district')}</option>
                                                                {selectedCurrentDistricts.map((district) => (
                                                                    <option key={district.value} value={district.value}>
                                                                        {district.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formik.errors.current_district && formik.touched.current_district && (
                                                                <div className='text-danger'>{formik.errors.current_district}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='form-group'>
                                                            <label htmlFor='current_village'>{t('boss.current_village')}</label>
                                                            <input
                                                                id='current_village'
                                                                type='text'
                                                                className='form-control'
                                                                {...formik.getFieldProps('current_village')}
                                                            />
                                                            {formik.errors.current_village && formik.touched.current_village && (
                                                                <div className='text-danger'>{formik.errors.current_village}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className='row'>
                                                <div className='col-md-12'>
                                                    <div className='form-group'>
                                                        <label htmlFor='type_residence_info' className='mt-4'>{t('boss.type_residence_info')}</label>
                                                        <input
                                                            id='type_residence_info'
                                                            type='text'
                                                            className='form-control mt-2'
                                                            style={{ height: '120px' }}
                                                            {...formik.getFieldProps('type_residence_info')}
                                                        />
                                                        {formik.errors.type_residence_info &&
                                                            formik.touched.type_residence_info && (
                                                                <div className='text-danger'>{formik.errors.type_residence_info}</div>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                <br />
                                <div className='row background-fa'>
                                    <div className='col-lg-12'>
                                        <legend className='fs-3'>
                                            <b>
                                                &nbsp;
                                                <i className={`fas fa-solid fa-paperclip text-primary fs-2 me-2`}></i>
                                                {t('boss.upload')}
                                            </b>
                                        </legend>
                                        <div className='row mb-8 m-10'>
                                            <FileUploader
                                                multiple={true}
                                                handleChange={handleDrop}
                                                onDrop={handleDrop}
                                                name='file'
                                                hoverTitle={t('boss.upload_files')}
                                                maxSize={30}
                                                label={t('boss.upload_files')}
                                                onTypeError={() => toast.error(t('error.invalid_file_type'))}
                                                onSizeError={() => toast.error(t('error.file_too_large'))
                                                }
                                            />
                                            <ul>
                                                {files.map((file, index) => (
                                                    <li key={index}>
                                                        {file.name}
                                                        <span onClick={() => handleFileRemove(index)}>
                                                            <i className='fas fa-times fs-4 text-danger mt-2 ms-2 bg-light-dark shadow cursor-pointer'></i>
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='d-flex justify-content-between mt-4'>
                            <button type='submit' className='btn btn-primary' disabled={loading}>
                                {loading ? t('boss.saving') : t('boss.update')}
                            </button>

                            <button
                                className='btn btn-danger'
                                type='button'
                                disabled={loading}
                                onClick={() => setShowModal(false)}
                            >
                                {t('boss.back')}
                            </button>
                        </div>

                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PersonnelDroneEditModal