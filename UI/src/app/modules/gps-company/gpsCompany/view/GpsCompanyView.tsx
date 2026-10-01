import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import BossList from './tabsComponents/Boss/list/BossList'
import AssistantList from './tabsComponents/Assistant/list/AssistantList'
import LicenseList from './tabsComponents/License/list/LicenseList'
import GpsCompanyComponents from './tabsComponents/company/GpsCompanyComponents'
import GpsCompanyAgencyList from '../../gpsCompanyAgency/list/GpsCompanyAgencyList'

const GpsCompanyView = () => {
  const { t } = useTranslation()

  const tabKeys = ['company', 'boss', 'assistant', 'license']

  const tabs = [
    { key: 'company', icon: 'fas fa-building' },
    { key: 'boss', icon: 'fas fa-user-tie' },
    { key: 'assistant', icon: 'fas fa-user-secret' },
    { key: 'agency', icon: 'fas fa-home' },
    { key: 'license', icon: 'fas fa-address-card' },
  ]

  const [activeTab, setActiveTab] = useState('company')

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return <GpsCompanyComponents />
      case 'boss':
        return <BossList />
      case 'agency':
        return <GpsCompanyAgencyList />
      case 'assistant':
        return <AssistantList />
      case 'license':
        return <LicenseList />
      default:
        return <GpsCompanyComponents />
    }
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div
        style={{
          background: '#fff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #eee',
            paddingBottom: '8px',
          }}
        >
          <ul
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '0',
              margin: '0',
              listStyle: 'none',
            }}
          >
            {tabs.map((tab) => (
              <li key={tab.key} style={{ display: 'inline' }}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    transition: '0.3s',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    background: activeTab === tab.key ? '#2563EB' : '#F3F4F6',
                    color: activeTab === tab.key ? '#fff' : '#374151',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <i className={tab.icon} style={{ fontSize: '18px' }}></i>
                  {t(`tabs.${tab.key}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '24px' }}>{renderContent()}</div>
    </div>
  )
}

export default GpsCompanyView
