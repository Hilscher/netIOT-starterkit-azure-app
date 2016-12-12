<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="EventProcessor" generation="1" functional="0" release="0" Id="b3560942-4c9a-4f02-a696-2f6efd1a1739" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="EventProcessorGroup" generation="1" functional="0" release="0">
      <settings>
        <aCS name="EventProcessorRole:APPINSIGHTS_INSTRUMENTATIONKEY" defaultValue="">
          <maps>
            <mapMoniker name="/EventProcessor/EventProcessorGroup/MapEventProcessorRole:APPINSIGHTS_INSTRUMENTATIONKEY" />
          </maps>
        </aCS>
        <aCS name="EventProcessorRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/EventProcessor/EventProcessorGroup/MapEventProcessorRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="EventProcessorRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/EventProcessor/EventProcessorGroup/MapEventProcessorRoleInstances" />
          </maps>
        </aCS>
      </settings>
      <maps>
        <map name="MapEventProcessorRole:APPINSIGHTS_INSTRUMENTATIONKEY" kind="Identity">
          <setting>
            <aCSMoniker name="/EventProcessor/EventProcessorGroup/EventProcessorRole/APPINSIGHTS_INSTRUMENTATIONKEY" />
          </setting>
        </map>
        <map name="MapEventProcessorRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/EventProcessor/EventProcessorGroup/EventProcessorRole/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapEventProcessorRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/EventProcessor/EventProcessorGroup/EventProcessorRoleInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="EventProcessorRole" generation="1" functional="0" release="0" software="C:\Users\maximjung\Documents\Visual Studio 2015\Projects\netIOTStarterKit\EventProcessor\csx\Release\roles\EventProcessorRole" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="-1" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <settings>
              <aCS name="APPINSIGHTS_INSTRUMENTATIONKEY" defaultValue="" />
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;EventProcessorRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;EventProcessorRole&quot; /&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/EventProcessor/EventProcessorGroup/EventProcessorRoleInstances" />
            <sCSPolicyUpdateDomainMoniker name="/EventProcessor/EventProcessorGroup/EventProcessorRoleUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/EventProcessor/EventProcessorGroup/EventProcessorRoleFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="EventProcessorRoleUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="EventProcessorRoleFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="EventProcessorRoleInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
</serviceModel>