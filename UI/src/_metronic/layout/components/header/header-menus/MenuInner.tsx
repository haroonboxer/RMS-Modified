import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {useTranslation} from 'react-i18next'
import {useAuth} from '../../../../../app/modules/auth'

export function MenuInner() {
  const {t} = useTranslation()
  const {hasPermission} = useAuth()

  const basePath = window.location.pathname.split('/')

  const currentBasePath = basePath[1] || ''

  if (currentBasePath == 'company' || currentBasePath == 'cards' || currentBasePath == 'report') {
    return (
      <>
        <MenuItem title={t('global.dashboard')} to='/dashboard' fontIcon='fas fa-home text-white' />

        <MenuItem
          to='/company/list'
          title={t('company.companyList')}
          fontIcon='fas fa-bars-progress'
          hasBullet={false}
        />
        <MenuItem
          title={t('global.printedCards')}
          fontIcon='fas fa-id-card text-white'
          to='/cards/list'
        />
        <MenuItem
          title={t('global.reports')}
          fontIcon='fas fa-arrow-down-a-z text-white'
          to='/report/list'
        />
      </>
    )
  } else if (currentBasePath == 'authentication') {
    return (
      <>
        {/* Related to admin */}
        {hasPermission('admin-create') && (
          <MenuInnerWithSub
            title={t('global.SYSTEMANAGEMENT')}
            to='/authentication/directorates'
            menuPlacement='bottom-end'
            menuTrigger='click'
            hasArrow={true}
            fontIcon='fas fa-cogs'
          >
            <MenuItem
              to='/authentication/users'
              title={t('global.users')}
              fontIcon='fas fa-users text-white'
              hasBullet={false}
            />
            <MenuItem
              to='/authentication/departments'
              title={t('user.departments')}
              fontIcon='fas fa-home text-white'
              hasBullet={false}
            />

            <MenuItem
              to='/authentication/roles'
              title={t('user.roles')}
              fontIcon='fas fa-sitemap text-white'
              hasBullet={false}
            />
          </MenuInnerWithSub>
        )}
      </>
    )
  } else if (currentBasePath == 'workshop' || currentBasePath == 'card-print') {
    return (
      <>
        <MenuItem title={t('global.dashboard')} to='/dashboard' fontIcon='fas fa-home text-white' />
        <MenuInnerWithSub
          menuPlacement='bottom-end'
          menuTrigger='click'
          hasArrow={true}
          to='/workshop/list'
          title={t('company.companyList')}
          fontIcon='fas fa- fa-building-shield'
          hasBullet={false}
        >
          <MenuItem
            to='/workshop/list'
            title={t('company.companyList')}
            fontIcon='fas fa- fa-building-shield'
            hasBullet={false}
          />
          <MenuItem
            to='/workshop/rejected-list'
            title={t('cards.rejected_license_list')}
            fontIcon='fas fa-home text-white'
            hasBullet={false}
          />
        </MenuInnerWithSub>
        {hasPermission('workshop-print-list') && (
          <MenuItem
            title={t('global.CardPrint')}
            to='/card-print/list'
            fontIcon='fas fa-id-card text-white'
          />
        )}

        <MenuItem
          title={t('global.reports')}
          fontIcon='fas fa-arrow-down-a-z text-white'
          to='/workshop/report/list'
        />
      </>
    )
  } else if (
    currentBasePath == 'gps-companies' ||
    currentBasePath == 'cards' ||
    currentBasePath == 'report'
  ) {
    return (
      <>
        <MenuItem title={t('global.dashboard')} to='/dashboard' fontIcon='fas fa-home text-white' />
        <MenuInnerWithSub
          menuPlacement='bottom-end'
          menuTrigger='click'
          hasArrow={true}
          to='/gps-companies/list'
          title={t('company.companyList')}
          fontIcon='fas fa- fa-building-shield'
          hasBullet={false}
        >
          <MenuItem
            to='/gps-companies/list'
            title={t('company.companyList')}
            fontIcon='fas fa- fa-building-shield'
            hasBullet={false}
          />
          <MenuItem
            // to='/gps-companies/gps-company-agency/list'
            to='/gps-companies/gps-company-all-agency/list'
            // title={t('cards.rejected_license_list')}
            title='لیست نماینده ګی '
            fontIcon='fas fa-home text-white'
            hasBullet={false}
          />
          <MenuItem
            to='/gps-companies/rejected-list'
            title={t('cards.rejected_license_list')}
            fontIcon='fas fa-home text-white'
            hasBullet={false}
          />
        </MenuInnerWithSub>
        {hasPermission('gps-print-list') && (
          <MenuItem
            title={t('global.CardPrint')}
            to='/gps-companies/card-print/list'
            fontIcon='fas fa-id-card text-white'
          />
        )}

        <MenuItem
          title={t('global.reports')}
          fontIcon='fas fa-arrow-down-a-z text-white'
          to='/gps-companies/report/list'
        />
      </>
    )
  } else if (
    currentBasePath == 'drone-camera' ||
    currentBasePath == 'drone-camera-card-print' ||
    currentBasePath == 'personnel-drone-camera-card-print' ||
    currentBasePath == 'personnel-drone-camera'
  ) {
    return (
      <>
        <MenuItem title={t('global.dashboard')} to='/dashboard' fontIcon='fas fa-home text-white' />
        <MenuInnerWithSub
          menuPlacement='bottom-end'
          menuTrigger='click'
          hasArrow={true}
          to='/drone-camera/list'
          title={t('company.headerMain')}
          fontIcon='fas fa- fa-building-shield'
          hasBullet={false}
        >
          <MenuItem
            to='/drone-camera/list'
            title={t('company.companyList')}
            fontIcon='fas fa-list-dots text-success'
            hasBullet={false}
          />
          <MenuItem
            to='/personnel-drone-camera/personnel-list'
            title={t('company.personnelList')}
            fontIcon='fas fa-list-dots text-warning'
            hasBullet={false}
          />
          <MenuItem
            to='/drone-camera/rejected-list'
            title={t('cards.rejected_license_list')}
            fontIcon='fas fa-ban text-danger'
            hasBullet={false}
          />
        </MenuInnerWithSub>
        {hasPermission('drone-print-list') && (
          <MenuInnerWithSub
            title={t('global.CardPrint')}
            to='/drone-camera-card-print/list'
            fontIcon='fas fa-id-card text-white'
            menuPlacement='bottom-end'
            menuTrigger='click'
            hasArrow={true}
          >
            <MenuItem
              title={t('global.CompanyCardPrint')}
              to='/drone-camera-card-print/list'
              fontIcon='fas fa-id-card text-white'
            />
            <MenuItem
              title={t('global.PersonnelCardPrint')}
              to='/personnel-drone-camera-card-print/list'
              fontIcon='fas fa-id-card text-white'
            />
          </MenuInnerWithSub>
        )}

        <MenuItem
          title={t('global.reports')}
          fontIcon='fas fa-arrow-down-a-z text-white'
          to='/drone-camera/report/list'
        />
      </>
    )
  } else if (currentBasePath == 'k9' || currentBasePath == 'k9-card-print') {
    return (
      <>
        <MenuItem title={t('global.dashboard')} to='/dashboard' fontIcon='fas fa-home text-white' />
        <MenuInnerWithSub
          menuPlacement='bottom-end'
          menuTrigger='click'
          hasArrow={true}
          to='/k9/list'
          title={t('company.companyList')}
          fontIcon='fas fa- fa-building-shield'
          hasBullet={false}
        >
          <MenuItem
            to='/k9/list'
            title={t('company.companyList')}
            fontIcon='fas fa- fa-building-shield'
            hasBullet={false}
          />
          <MenuItem
            to='/k9/rejected-list'
            title={t('cards.rejected_license_list')}
            fontIcon='fas fa-home text-white'
            hasBullet={false}
          />
        </MenuInnerWithSub>
        {hasPermission('workshop-print-list') && (
          <MenuItem
            title={t('global.CardPrint')}
            to='/k9-card-print/list'
            fontIcon='fas fa-id-card text-white'
          />
        )}

        <MenuItem
          title={t('global.reports')}
          fontIcon='fas fa-arrow-down-a-z text-white'
          to='/k9/report/list'
        />
      </>
    )
  } else {
    return null
  }
}
