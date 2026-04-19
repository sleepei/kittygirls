const appState = {
  answered: 0,
  correct: 0,
  total: 120,
  revealed: new Set()
};

const officialScenarios = [
  {
    id: 'bytebooks',
    label: 'Official scenario 1',
    title: 'ByteBooks Online — AWS Web Deployment',
    description: 'Practice Scenario from MOD006125_Practice_Practical_Questions-1.pdf.',
    source: 'Exact questions and exact answers from the attached official practice practical PDF.',
    artefacts: [
      {
        title: 'IAM Policy — Web Developer Access',
        content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::bytebooks-website",
        "arn:aws:s3:::bytebooks-website/*"
      ]
    },
    {
      "Effect": "Deny",
      "Action": "s3:DeleteBucket",
      "Resource": "arn:aws:s3:::bytebooks-website"
    }
  ]
}`
      },
      {
        title: 'VPC Design',
        content: `VPC CIDR: 10.0.0.0/16
Public Subnet: 10.0.1.0/24 (eu-west-2a)
Private Subnet: 10.0.2.0/24 (eu-west-2a)`
      },
      {
        title: 'Security Group — Web Server (sg-bytebooks)',
        content: `Inbound Rules:
HTTP TCP 80 0.0.0.0/0
SSH TCP 22 10.0.0.0/16

Outbound Rules:
All Traffic All All 0.0.0.0/0`
      },
      {
        title: 'EC2 Launch Command + User Data',
        content: `aws ec2 run-instances \\
 --image-id ami-0abcdef1234567890 \\
 --instance-type t3.micro \\
 --key-name bytebooks-key \\
 --subnet-id subnet-pub01 \\
 --security-group-ids sg-bytebooks \\
 --user-data file://install.sh... #!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
aws s3 sync s3://bytebooks-website/html /var/www/html`
      },
      {
        title: 'CLI Output — Running Instance',
        content: `{
  "InstanceId": "i-0bb1234567example",
  "InstanceType": "t3.micro",
  "State": {"Name": "running"},
  "PublicIpAddress": "52.56.78.90",
  "PrivateIpAddress": "10.0.1.42",
  "SubnetId": "subnet-pub01"
}`
      }
    ],
    questions: [
      {
        type: 'Ordering',
        marks: 2,
        text: 'Order the steps to deploy the ByteBooks web server on AWS. Place these steps in the correct sequence:',
        items: [
          'Launch the EC2 instance with the aws ec2 run-instances command',
          'Create the VPC with CIDR block 10.0.0.0/16',
          'Create the public and private subnets',
          'Create and attach an Internet Gateway, then configure the public route table',
          'Create the security group sg-bytebooks with HTTP and SSH rules',
          'Test the website by browsing to the instance\'s public IP address'
        ],
        answer: '1. Create the VPC with CIDR block 10.0.0.0/16 → 2. Create the public and private subnets → 3. Create and attach an Internet Gateway, then configure the public route table → 4. Create the security group sg-bytebooks with HTTP and SSH rules → 5. Launch the EC2 instance with the aws ec2 run-instances command → 6. Test the website by browsing to the instance\'s public IP address.'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each component of the EC2 launch command to its purpose.',
        items: [
          '--image-id ami-0abcdef1234567890 → ?',
          '--instance-type t3.micro → ?',
          '--key-name bytebooks-key → ?',
          '--user-data file://install.sh → ?'
        ],
        answer: '--image-id → C. Specifies the Amazon Machine Image template; --instance-type → D. Defines the vCPU and memory resources; --key-name → A. Sets the SSH key pair for remote access; --user-data → B. Provides a bootstrap script to run at first boot.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'Complete the CLI command to connect to the ByteBooks web server via SSH: ssh -i _______________.pem ec2-user@52.56.78.90',
        answer: 'bytebooks-key'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Based on the sg-bytebooks security group rules, which types of inbound traffic are permitted? (Select ALL that apply)',
        options: [
          'A. HTTP traffic from any IP address on port 80',
          'B. HTTPS traffic from any IP address on port 443',
          'C. SSH traffic from any IP within the VPC (10.0.0.0/16) on port 22',
          'D. SSH traffic from any IP address on the internet on port 22'
        ],
        answer: 'A and C'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The User Data script (install.sh) will re-execute automatically every time the EC2 instance is rebooted.',
        options: ['True', 'False'],
        answer: 'False'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'A web developer with the IAM policy shown above runs aws s3 rb s3://bytebooks-website --force. What is the outcome?',
        options: [
          'A. The bucket is deleted successfully',
          'B. The bucket contents are deleted but the bucket remains',
          'C. The request is denied because of the explicit Deny on s3:DeleteBucket',
          'D. The request is queued for admin approval'
        ],
        answer: 'C. The request is denied because of the explicit Deny on s3:DeleteBucket'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'The website is not loading in a browser despite the instance being in the "running" state. Order the troubleshooting steps from first to last.',
        items: [
          'SSH into the instance and run systemctl status httpd to check Apache',
          'Verify the security group allows inbound HTTP on port 80',
          'Check the route table has a route to the Internet Gateway',
          'Examine /var/log/cloud-init-output.log for User Data script errors',
          'Confirm the instance has a public IP address'
        ],
        answer: '1. Verify the security group allows inbound HTTP on port 80 → 2. Check the route table has a route to the Internet Gateway → 3. Confirm the instance has a public IP address → 4. SSH into the instance and run systemctl status httpd to check Apache → 5. Examine /var/log/cloud-init-output.log for User Data script errors.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The instance\'s private IP is 10.0.1.42. Based on the VPC design, this instance is in the _______ subnet.',
        answer: 'Public'
      },
      {
        type: 'Multiple Fill in the Blanks',
        marks: 2,
        text: 'Complete the AWS CLI command to check the details of the running instance: aws _______ _______ --instance-ids i-0bb1234567example',
        answer: 'ec2 and describe-instances'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each statement to either Security Group or Network ACL.',
        items: [
          'Stateful — return traffic is automatically allowed',
          'Operates at the subnet level',
          'Operates at the instance level',
          'Stateless — return traffic must be explicitly allowed'
        ],
        answer: 'Stateful → Security Group; Operates at subnet level → Network ACL; Operates at instance level → Security Group; Stateless → Network ACL.'
      }
    ]
  },
  {
    id: 'medistore',
    label: 'Official scenario 2',
    title: 'MediStore — Cloud Deployment',
    description: 'Scenario 1 from the exam prep bundle.',
    source: 'Exact questions from the attached prep bundle scenario text. Answers are derived from the same official artefacts and prep notes in the PDF.',
    artefacts: [
      {
        title: 'IAM Policy',
        content: `{
  "Effect":"Allow",
  "Action":["ec2:DescribeInstances","ec2:StartInstances"],
  "Resource":"*"
},
{
  "Effect":"Deny",
  "Action":"ec2:StopInstances",
  "Resource":"*"
}`
      },
      {
        title: 'EC2 Launch Command',
        content: `aws ec2 run-instances --image-id ami-123abc --instance-type t2.micro --subnet-id subnet-private --security-group-ids Web-SG`
      },
      {
        title: 'User Data Script',
        content: `#!/bin/bash
dnf install -y httpd
systemctl start httpd
systemctl enable httpd`
      },
      {
        title: 'CLI Output',
        content: `{
  "InstanceId":"i-abc123",
  "State":{"Name":"running"},
  "PublicIpAddress":null,
  "SubnetId":"subnet-private"
}`
      }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Why is the web server not accessible from the internet?',
        options: ['A. IAM issue', 'B. Instance stopped', 'C. Private subnet', 'D. Apache missing'],
        answer: 'C. Private subnet'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which components enable high availability? (Select ALL)',
        options: ['A. Multi-AZ RDS', 'B. Auto Scaling', 'C. Single instance', 'D. Load Balancer'],
        answer: 'A, B, and D'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'aws ec2 ________ --instance-ids i-abc123',
        answer: 'describe-instances'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'Instance receives public IP automatically.',
        options: ['True', 'False'],
        answer: 'False'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What happens when stop-instances runs?',
        options: ['A Stops', 'B Denied', 'C Restart', 'D Nothing'],
        answer: 'B. Denied'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Order steps: VPC, Subnet, SG, EC2, RDS',
        items: ['VPC', 'Subnet', 'SG', 'EC2', 'RDS'],
        answer: 'VPC → Subnet → SG → EC2 → RDS'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'DB access rules? (Select ALL)',
        options: ['A Internet', 'B Web-SG', 'C Private subnet', 'D Public IP'],
        answer: 'B and C'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'EBS is ______ storage',
        answer: 'block'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Troubleshoot: SG, route, instance, Apache',
        items: ['SG', 'route', 'instance', 'Apache'],
        answer: 'SG → route → instance → Apache'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match SG vs NACL properties',
        items: ['Stateful', 'Stateless', 'Subnet level', 'Instance level'],
        answer: 'Security Group: Stateful, Instance level. Network ACL: Stateless, Subnet level.'
      }
    ]
  },
  {
    id: 'finanalytics',
    label: 'Official scenario 3',
    title: 'FinAnalytics — Data Platform',
    description: 'Scenario 2 from the exam prep bundle.',
    source: 'Exact question wording from the attached prep bundle scenario text.',
    artefacts: [
      {
        title: 'Artefact 1 — Lambda Function',
        content: `import boto3
region = 'us-east-1'
instances = ['i-abc123']
ec2 = boto3.client('ec2', region_name=region)

def lambda_handler(event, context):
    ec2.stop_instances(InstanceIds=instances)`
      },
      {
        title: 'Artefact 2 — EventBridge Rule',
        content: `rate(1 minute)`
      },
      {
        title: 'Artefact 3 — EC2 + EBS',
        content: `Instance ID: i-abc123
Device: /dev/sdf
Mount: /mnt/data`
      },
      {
        title: 'Artefact 4 — CLI Output',
        content: `{
  "InstanceId":"i-abc123",
  "State":{"Name":"running"}
}`
      },
      {
        title: 'Artefact 5 — Auto Scaling',
        content: `Min: 2
Max: 6
Target CPU: 70%`
      },
      {
        title: 'Artefact 6 — Elastic Beanstalk Environment',
        content: `Healthy
Instances: 2
Load Balancer: Enabled`
      }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Based on the Lambda function, what is the primary purpose of this automation?',
        options: [
          'A. To start EC2 instances automatically',
          'B. To stop EC2 instances on a schedule',
          'C. To monitor CPU utilisation',
          'D. To create EBS snapshots'
        ],
        answer: 'B. To stop EC2 instances on a schedule'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The Lambda function requires a continuously running EC2 instance in order to execute.',
        options: ['True', 'False'],
        answer: 'False'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'Amazon EBS snapshots are stored in __________.',
        answer: 'Amazon S3'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which steps are required to restore data from an EBS snapshot? (Select ALL that apply)',
        options: [
          'A. Create a new volume from the snapshot',
          'B. Attach the snapshot directly to the EC2 instance',
          'C. Attach the restored volume to an EC2 instance',
          'D. Mount the volume to the file system'
        ],
        answer: 'A, C, and D'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each AWS service to its primary function.',
        items: [
          'Elastic Beanstalk',
          'AWS Lambda',
          'Amazon EBS',
          'Elastic Load Balancer'
        ],
        answer: 'Elastic Beanstalk → A. Managed application deployment; AWS Lambda → B. Event-driven compute; Amazon EBS → C. Persistent block storage; Elastic Load Balancer → D. Traffic distribution.'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Place the following steps in the correct order to restore data from an EBS snapshot:',
        items: [
          'Create a snapshot',
          'Create a volume from the snapshot',
          'Attach the volume to the instance',
          'Mount the volume'
        ],
        answer: 'Create a snapshot → Create a volume from the snapshot → Attach the volume to the instance → Mount the volume'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Why are two EC2 instances running in the Elastic Beanstalk environment?',
        options: [
          'A. Manual configuration by user',
          'B. Default high availability configuration',
          'C. Lambda function created them',
          'D. IAM policy requirement'
        ],
        answer: 'B. Default high availability configuration'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Under which conditions will Auto Scaling increase the number of instances? (Select ALL that apply)',
        options: [
          'A. CPU utilisation exceeds threshold',
          'B. CloudWatch alarm is triggered',
          'C. Lambda function executes',
          'D. Snapshot is created'
        ],
        answer: 'A and B'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The device name /dev/sdf represents an attached __________.',
        answer: 'EBS volume device'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'An EC2 instance is stopping unexpectedly. Place the troubleshooting steps in the correct order:',
        items: [
          'Check Lambda triggers',
          'Check EventBridge schedule',
          'Check EC2 instance logs',
          'Disable or modify the Lambda function'
        ],
        answer: 'Check EC2 instance logs → Check Lambda triggers → Check EventBridge schedule → Disable or modify the Lambda function'
      }
    ]
  }
,
  {
    id: 'shopease',
    label: 'Official scenario 4',
    title: 'ShopEase Retail — AWS Web Application Deployment',
    description: 'Scenario from the Practical Exam Final Preparatory Bundle (April 2026).',
    source: 'Questions and answers from the attached Practical Exam Final Preparatory Bundle PDF.',
    artefacts: [
      {
        title: 'IAM Policy — Developer Access',
        content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEC2ReadOnly",
      "Effect": "Allow",
      "Action": ["ec2:Describe*"],
      "Resource": "*"
    },
    {
      "Sid": "AllowDevS3Access",
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::shopease-dev-*",
        "arn:aws:s3:::shopease-dev-*/*"
      ]
    },
    {
      "Sid": "DenyProdS3",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::shopease-prod-*",
        "arn:aws:s3:::shopease-prod-*/*"
      ]
    }
  ]
}`
      },
      {
        title: 'IAM Policy — Admin Access',
        content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAllEC2InRegion",
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*",
      "Condition": {
        "StringEquals": {"aws:RequestedRegion": "eu-west-2"}
      }
    },
    {
      "Sid": "AllowAllRDS",
      "Effect": "Allow",
      "Action": "rds:*",
      "Resource": "*"
    }
  ]
}`
      },
      {
        title: 'VPC Design',
        content: `VPC CIDR: 10.2.0.0/16  Region: eu-west-2
Public Subnet A:  10.2.1.0/24  (eu-west-2a)
Public Subnet B:  10.2.2.0/24  (eu-west-2b)
Private Subnet A: 10.2.10.0/24 (eu-west-2a)
Private Subnet B: 10.2.20.0/24 (eu-west-2b)`
      },
      {
        title: 'Route Tables & Security Groups',
        content: `Route Table — Public:  0.0.0.0/0 → igw-123abc
Route Table — Private: 0.0.0.0/0 → nat-789xyz

SG — Web Server (sg-web) Inbound:
  HTTP  TCP  80   0.0.0.0/0
  HTTPS TCP  443  0.0.0.0/0
  SSH   TCP  22   10.2.0.0/16

SG — Database (sg-db) Inbound:
  MySQL TCP  3306 sg-web`
      },
      {
        title: 'EC2 Launch Command & User Data',
        content: `aws ec2 run-instances \
  --image-id ami-0a1b2c3d4e5f6g7h \
  --instance-type t3.small \
  --key-name shopease-key \
  --subnet-id subnet-public-a \
  --security-group-ids sg-web \
  --user-data file://bootstrap.sh

#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Welcome to ShopEase</h1>" > /var/www/html/index.html`
      },
      {
        title: 'CLI Output & Billing Dashboard',
        content: `{
  "InstanceId": "i-0123456789example",
  "InstanceType": "t3.small",
  "State": {"Name": "running"},
  "PublicIpAddress": "18.130.55.21",
  "PrivateIpAddress": "10.2.1.25",
  "SubnetId": "subnet-public-a"
}

Monthly Billing:
  EC2:           £72.40
  RDS:           £34.20
  S3:            £6.80
  Data Transfer: £3.10
  Total:         £116.50`
      }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'A developer attempts to access arn:aws:s3:::shopease-prod-data. What is the result?',
        options: [
          'A. Access is granted due to s3:*',
          'B. Access is denied due to explicit Deny',
          'C. Access is granted if the bucket exists',
          'D. Access is granted only for read operations'
        ],
        answer: 'B. Access is denied due to explicit Deny. The "DenyProdS3" statement denies s3:* on shopease-prod-* resources. Explicit Deny always overrides Allow.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The Admin policy allows EC2 actions in any AWS region.',
        options: ['True', 'False'],
        answer: 'False. The Admin EC2 policy includes a Condition restricting it to "aws:RequestedRegion": "eu-west-2". EC2 actions in any other region are blocked.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The condition "aws:RequestedRegion": "eu-west-2" restricts EC2 actions to the ______ region.',
        answer: 'eu-west-2 (London)'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which inbound traffic is allowed to the web server sg-web? (Select ALL that apply)',
        options: [
          'A. HTTP from 0.0.0.0/0',
          'B. HTTPS from 0.0.0.0/0',
          'C. SSH from 0.0.0.0/0',
          'D. SSH from 10.2.0.0/16'
        ],
        answer: 'A, B, and D. HTTP (port 80) and HTTPS (port 443) allow all traffic. SSH (port 22) is restricted to the VPC CIDR 10.2.0.0/16 only — never 0.0.0.0/0 in production.'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each networking component to its function.',
        items: [
          'Internet Gateway → ?',
          'NAT Gateway → ?',
          'Security Group → ?',
          'Route Table → ?'
        ],
        answer: 'Internet Gateway → Provides internet access to public subnets; NAT Gateway → Enables outbound-only internet for private subnets; Security Group → Controls inbound/outbound traffic rules; Route Table → Directs traffic between networks.'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Order the correct steps to deploy the ShopEase web server:',
        items: [
          'Create VPC',
          'Create subnets',
          'Configure route tables and attach IGW',
          'Create security groups',
          'Launch EC2 instance',
          'Test website via public IP'
        ],
        answer: '1. Create VPC → 2. Create subnets → 3. Configure route tables and attach IGW → 4. Create security groups → 5. Launch EC2 instance → 6. Test website via public IP'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The EC2 instance has private IP 10.2.1.25. Based on the VPC design, this instance is in ______ subnet.',
        answer: 'Public Subnet A (10.2.1.0/24, eu-west-2a)'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'Instances in private subnets cannot access the internet at all.',
        options: ['True', 'False'],
        answer: 'False. The private route table routes 0.0.0.0/0 through the NAT Gateway, enabling outbound internet access. They cannot receive inbound connections from the internet.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What allows instances in private subnets to install packages from the internet?',
        options: [
          'A. Internet Gateway',
          'B. NAT Gateway',
          'C. Security Group',
          'D. VPC Peering'
        ],
        answer: 'B. NAT Gateway. The private route table directs 0.0.0.0/0 to the NAT Gateway — this provides outbound-only internet access for package installs.'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which statements about security groups are true? (Select ALL that apply)',
        options: [
          'A. They are stateful',
          'B. They operate at the subnet level',
          'C. Return traffic is automatically allowed',
          'D. They require explicit rules for return traffic'
        ],
        answer: 'A and C. Security groups are stateful and operate at the instance level. Return traffic is automatically permitted — you do not need explicit outbound rules to allow it.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'To SSH into the instance: ssh -i __________.pem ec2-user@18.130.55.21',
        answer: 'shopease-key (from --key-name shopease-key in the EC2 launch command)'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What happens if the admin runs: aws ec2 run-instances --region us-east-1?',
        options: [
          'A. Instance launches successfully',
          'B. The request is denied',
          'C. Instance launches with a warning',
          'D. The request is redirected to eu-west-2'
        ],
        answer: 'B. The request is denied. The Admin EC2 policy restricts all ec2:* actions to eu-west-2 via a StringEquals condition. A us-east-1 request does not satisfy the condition.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The User Data script runs every time the EC2 instance is restarted.',
        options: ['True', 'False'],
        answer: 'False. User Data only runs on the first boot of the instance. Stopping and restarting does NOT re-execute the script.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Why is SSH restricted to 10.2.0.0/16 rather than 0.0.0.0/0?',
        options: [
          'A. To improve network performance',
          'B. To restrict administrative access to within the VPC only',
          'C. To reduce cost',
          'D. It is required by the NAT Gateway'
        ],
        answer: 'B. Restricting SSH to the VPC CIDR prevents public SSH access from the internet — a critical security best practice. SSH from 0.0.0.0/0 is never acceptable in production.'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Order the troubleshooting steps when the website is not accessible:',
        items: [
          'Check security group allows HTTP port 80',
          'Verify route table points to IGW',
          'Confirm instance has a public IP',
          'Check Apache service status',
          'Review /var/log/cloud-init-output.log'
        ],
        answer: '1. Check security group allows HTTP port 80 → 2. Verify route table points to IGW → 3. Confirm instance has a public IP → 4. Check Apache service status → 5. Review /var/log/cloud-init-output.log. Work outside-in: network first, then application.'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which issues could prevent the website from loading? (Select ALL that apply)',
        options: [
          'A. Missing HTTP rule in the security group',
          'B. No public IP assigned to the instance',
          'C. Apache service not running',
          'D. Incorrect IAM developer policy'
        ],
        answer: 'A, B, and C. Missing HTTP rule blocks traffic, no public IP makes instance unreachable, and Apache not running means no HTTP response. IAM policy controls AWS API access, not web traffic.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The database security group allows inbound MySQL traffic on port ______.',
        answer: '3306 (standard MySQL port, as defined in the sg-db inbound rules)'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Why does sg-db use sg-web as the inbound source instead of an IP range?',
        options: [
          'A. Easier to configure',
          'B. Improves RDS performance',
          'C. Dynamically allows all web servers in that security group regardless of IP',
          'D. It is required by AWS for RDS'
        ],
        answer: 'C. Using sg-web as source dynamically covers all instances in that group. As web servers are added or replaced, the database rule automatically applies — unlike hardcoded IPs.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The RDS database is publicly accessible from the internet.',
        options: ['True', 'False'],
        answer: 'False. The RDS is in private subnets (10.2.10.0/24, 10.2.20.0/24) with no public IP, and the private route table routes via NAT — not directly to an IGW.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What happens during an RDS Multi-AZ failure?',
        options: [
          'A. Data is permanently lost',
          'B. Manual failover is required by the DBA',
          'C. Automatic failover to the standby replica occurs',
          'D. The database stops permanently'
        ],
        answer: 'C. Automatic failover occurs. Multi-AZ maintains a synchronous standby replica in a second AZ. On failure, RDS promotes the standby automatically using the same endpoint.'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which services appear in the monthly billing dashboard? (Select ALL that apply)',
        options: [
          'A. EC2',
          'B. RDS',
          'C. S3',
          'D. Lambda'
        ],
        answer: 'A, B, and C. The billing shows EC2 (£72.40), RDS (£34.20), S3 (£6.80), and Data Transfer (£3.10). Lambda is not listed.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Which service is the biggest cost driver this month?',
        options: [
          'A. S3',
          'B. RDS',
          'C. EC2',
          'D. Data Transfer'
        ],
        answer: 'C. EC2 at £72.40 is the largest item. RDS is second at £34.20.'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each CIDR to its subnet type.',
        items: [
          '10.2.1.0/24 → ?',
          '10.2.2.0/24 → ?',
          '10.2.10.0/24 → ?',
          '10.2.20.0/24 → ?'
        ],
        answer: '10.2.1.0/24 → Public Subnet A (eu-west-2a); 10.2.2.0/24 → Public Subnet B (eu-west-2b); 10.2.10.0/24 → Private Subnet A (eu-west-2a); 10.2.20.0/24 → Private Subnet B (eu-west-2b)'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'Complete the CLI command to check the running instance: aws ______ ______ --instance-ids i-0123456789example',
        answer: 'ec2 describe-instances'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which actions are allowed for the Developer IAM policy? (Select ALL that apply)',
        options: [
          'A. Describe EC2 instances',
          'B. Terminate EC2 instances',
          'C. Access shopease-dev-* S3 buckets',
          'D. Delete shopease-prod-* S3 buckets'
        ],
        answer: 'A and C. Developers can use ec2:Describe* (read-only) and s3:* on dev buckets. The explicit Deny on prod buckets blocks access there; terminating EC2 is not in ec2:Describe*.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What is the BEST strategy to reduce monthly EC2 cost?',
        options: [
          'A. Switch to t3.nano regardless of load',
          'B. Delete the RDS instance',
          'C. Right-size the instance and use Reserved Instances',
          'D. Move to a different AWS region'
        ],
        answer: 'C. Right-sizing and Reserved Instances can cut EC2 cost significantly (up to 72%) without compromising performance. t3.nano may be too small; deleting RDS does not affect EC2 cost.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'Security groups require explicit outbound rules for return traffic to reach clients.',
        options: ['True', 'False'],
        answer: 'False. Security groups are stateful — return traffic for established connections is automatically allowed regardless of outbound rules.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'A developer runs: aws s3 cp file.txt s3://shopease-prod-backup. What happens?',
        options: [
          'A. Upload succeeds',
          'B. Upload is denied by the DenyProdS3 policy',
          'C. Upload succeeds but file is encrypted',
          'D. Upload is queued for admin approval'
        ],
        answer: 'B. Upload is denied by the DenyProdS3 policy. The explicit Deny on s3:* for shopease-prod-* resources blocks the operation. Explicit Deny always wins.'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Order the IAM onboarding steps for a new developer:',
        items: [
          'Create IAM user',
          'Add user to developer group',
          'Generate access credentials',
          'Test access by describing EC2 instances'
        ],
        answer: '1. Create IAM user → 2. Add user to developer group → 3. Generate access credentials → 4. Test access by describing EC2 instances. Permissions are inherited from the group.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The User Data log file to check if the bootstrap script ran correctly is: /var/log/______',
        answer: 'cloud-init-output.log'
      }
    ]
  },
  {
    id: 'meddata',
    label: 'Official scenario 5',
    title: 'MedData Analytics — Multi-Service Platform',
    description: 'Scenario from the Practical Exam Final Preparatory Bundle (April 2026), covering S3, EBS, DynamoDB, Auto Scaling, ALB, CloudWatch, and CloudFormation.',
    source: 'Questions and answers from the attached Practical Exam Final Preparatory Bundle PDF.',
    artefacts: [
      {
        title: 'Artefact 1 — S3 Bucket Policy',
        content: `{
  "Sid": "AllowCloudFront",
  "Effect": "Allow",
  "Principal": {"Service": "cloudfront.amazonaws.com"},
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::meddata-analytics-bucket/public/*"
},
{
  "Sid": "DenyUnencryptedUploads",
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:PutObject",
  "Resource": "arn:aws:s3:::meddata-analytics-bucket/*",
  "Condition": {
    "StringNotEquals": {
      "s3:x-amz-server-side-encryption": "aws:kms"
    }
  }
}`
      },
      {
        title: 'Artefact 2 — S3 Lifecycle Rule',
        content: `{
  "Rules": [{
    "ID": "ArchiveReports",
    "Status": "Enabled",
    "Filter": {"Prefix": "reports/"},
    "Transitions": [
      {"Days": 30,  "StorageClass": "STANDARD_IA"},
      {"Days": 90,  "StorageClass": "GLACIER"}
    ],
    "Expiration": {"Days": 365}
  }]
}`
      },
      {
        title: 'Artefact 3 — EBS Configuration',
        content: `Analytics-Node-1:
  Root: gp3,  30 GB
  Data: io2,  400 GB, 12000 IOPS

Analytics-Node-2:
  Root: gp3,  30 GB
  Data: gp3,  200 GB`
      },
      {
        title: 'Artefact 4 — DynamoDB Table',
        content: `aws dynamodb create-table \
  --table-name PatientSessions \
  --attribute-definitions \
    AttributeName=PatientId,AttributeType=S \
    AttributeName=Timestamp,AttributeType=N \
  --key-schema \
    AttributeName=PatientId,KeyType=HASH \
    AttributeName=Timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST`
      },
      {
        title: 'Artefact 5 — Auto Scaling Group',
        content: `ASG: meddata-asg
LaunchTemplate: meddata-lt ($Latest)
MinSize: 2 | MaxSize: 6 | DesiredCapacity: 2
AZs: eu-west-2a, eu-west-2b
HealthCheckType: ELB | GracePeriod: 300s

Scaling Policy: TargetTrackingScaling
TargetValue: 65.0% CPU
ScaleOutCooldown: 60s | ScaleInCooldown: 300s`
      },
      {
        title: 'Artefact 6 — ALB, CloudWatch & Billing',
        content: `ALB: meddata-alb (internet-facing)
Listener: HTTPS 443 → meddata-tg (HTTP 80)
Health Check: /status | Interval: 30s | Unhealthy threshold: 2

CloudWatch Alarm: HighCPU-MedData
Metric: CPUUtilization > 75% | Period: 300s | Eval periods: 2

Monthly Cost:
  EC2:           £410
  RDS:           £210
  S3:            £18.50
  DynamoDB:      £12
  ELB:           £55
  CloudWatch:    £8.20
  Data Transfer: £35
  Total:         £748.70`
      }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'A user uploads an object to meddata-analytics-bucket without specifying any encryption. What happens?',
        options: [
          'A. Upload succeeds with default encryption applied automatically',
          'B. Upload is denied by the bucket policy',
          'C. Upload succeeds but the object is inaccessible',
          'D. Upload is automatically moved to STANDARD_IA'
        ],
        answer: 'B. Upload is denied by the bucket policy. The DenyUnencryptedUploads statement denies s3:PutObject when the header s3:x-amz-server-side-encryption is not "aws:kms". No encryption = explicit Deny.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The S3 bucket policy allows any internet user to download objects from the bucket.',
        options: ['True', 'False'],
        answer: 'False. Only the CloudFront service principal can access objects under /public/. The "Principal": "cloudfront.amazonaws.com" restricts access to CloudFront — not anonymous users.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'To successfully upload an object, the CLI command must include the header: --server-side-encryption ______',
        answer: 'aws:kms'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which entities are permitted to access objects in meddata-analytics-bucket/public/? (Select ALL that apply)',
        options: [
          'A. CloudFront service',
          'B. Any authenticated AWS user',
          'C. EC2 instances with any role',
          'D. Anonymous internet users'
        ],
        answer: 'A. CloudFront only. The Allow statement grants s3:GetObject exclusively to cloudfront.amazonaws.com on the /public/* prefix. Do not confuse the folder name "public" with open internet access.'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each storage lifecycle phase to its storage class.',
        items: [
          '0–30 days → ?',
          '30–90 days → ?',
          '90–365 days → ?',
          'After 365 days → ?'
        ],
        answer: '0–30 days → STANDARD; 30–90 days → STANDARD_IA; 90–365 days → GLACIER; After 365 days → Deleted (Expiration rule)'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Order the lifecycle stages of an object stored under reports/:',
        items: [
          'Glacier archive',
          'Object deleted',
          'Standard storage',
          'Standard-IA'
        ],
        answer: '1. Standard storage → 2. Standard-IA → 3. Glacier archive → 4. Object deleted'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Which analytics node is optimised for high-performance I/O workloads?',
        options: [
          'A. Analytics Node 2',
          'B. Analytics Node 1',
          'C. Both are equally optimised',
          'D. Neither — both use gp3'
        ],
        answer: 'B. Analytics Node 1. It uses an io2 volume explicitly provisioned at 12,000 IOPS. io2 is the high-performance EBS type for demanding workloads. Node 2 uses standard gp3 without explicit IOPS.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The gp3 volume on Analytics Node 2 is provisioned with 12,000 IOPS.',
        options: ['True', 'False'],
        answer: 'False. Only Analytics Node 1 has an explicit 12,000 IOPS setting on its io2 volume. Node 2\'s gp3 volume lists no explicit IOPS configuration.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The DynamoDB partition key (HASH key) for the PatientSessions table is ______.',
        answer: 'PatientId (AttributeName=PatientId, KeyType=HASH)'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Which DynamoDB query pattern is the most efficient for this table?',
        options: [
          'A. Scan the entire table',
          'B. Query using only Timestamp',
          'C. Query using PatientId',
          'D. Query without any key condition'
        ],
        answer: 'C. Query using PatientId. The partition key (HASH) gives direct access to a partition. Scans and keyless queries are expensive full-table reads — always query by partition key first.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'Switching the table from PAY_PER_REQUEST to PROVISIONED billing requires specifying read and write capacity units.',
        options: ['True', 'False'],
        answer: 'True. PAY_PER_REQUEST is serverless on-demand. PROVISIONED mode requires you to specify RCU and WCU values that DynamoDB will maintain.'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which are direct components of the Auto Scaling Group configuration? (Select ALL that apply)',
        options: [
          'A. Launch Template',
          'B. MinSize / MaxSize',
          'C. Availability Zones',
          'D. Security Groups (as a direct ASG property)'
        ],
        answer: 'A, B, and C. The ASG config includes LaunchTemplate, MinSize, MaxSize, DesiredCapacity, and AvailabilityZones. Security Groups are defined inside the Launch Template, not as a top-level ASG property.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'If DesiredCapacity is manually set to 8, what happens?',
        options: [
          'A. ASG scales to 8 instances',
          'B. ASG update fails with an error',
          'C. ASG caps at MaxSize of 6',
          'D. ASG terminates all instances'
        ],
        answer: 'C. ASG caps at MaxSize of 6. You cannot set DesiredCapacity above MaxSize — the ASG enforces the upper boundary constraint.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The ASG will never run fewer than ______ instances.',
        answer: '2 (MinSize: 2 in the ASG configuration)'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'When average CPU rises above 65%, what does the scaling policy do?',
        options: [
          'A. Scales in (removes instances)',
          'B. Scales out (adds instances)',
          'C. No action until MaxSize is reached',
          'D. Restarts existing instances'
        ],
        answer: 'B. Scales out. The target tracking policy targets 65% CPU. Rising above target triggers scale-out to add capacity and bring CPU back toward the target.'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'Based on the cooldown values, scale-in happens faster than scale-out.',
        options: ['True', 'False'],
        answer: 'False. ScaleOutCooldown is 60s and ScaleInCooldown is 300s. Scale-out reacts quickly (60s); scale-in waits longer (300s) to avoid prematurely removing capacity.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What protocol does the ALB use when forwarding traffic to the target instances?',
        options: [
          'A. HTTPS',
          'B. HTTP',
          'C. TCP',
          'D. UDP'
        ],
        answer: 'B. HTTP. The ALB listener accepts HTTPS (port 443) and terminates SSL/TLS, then forwards requests to targets using HTTP (port 80). This is called SSL termination at the load balancer.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The ALB health check path is ______.',
        answer: '/status (configured in the target group health check settings)'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'After how long does the ALB mark a target as unhealthy?',
        options: [
          'A. 30 seconds',
          'B. 60 seconds',
          'C. 90 seconds',
          'D. 300 seconds'
        ],
        answer: 'B. 60 seconds. Unhealthy threshold is 2 failed checks × 30s interval = 60 seconds of consecutive failures before the instance is marked unhealthy.'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which services are directly involved in automatic scaling decisions? (Select ALL that apply)',
        options: [
          'A. CloudWatch',
          'B. Auto Scaling Group',
          'C. S3',
          'D. ALB'
        ],
        answer: 'A, B, and D. CloudWatch monitors metrics and triggers alarms, the ASG executes scaling actions, and the ALB provides ELB health checks that the ASG uses. S3 plays no role in scaling.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'When exactly will the HighCPU-MedData CloudWatch alarm trigger?',
        options: [
          'A. Immediately when CPU exceeds 75% once',
          'B. After one 5-minute evaluation period',
          'C. After two consecutive 5-minute periods above 75%',
          'D. After scaling has already occurred'
        ],
        answer: 'C. After two consecutive 5-minute periods above 75%. The alarm requires EvaluationPeriods: 2 with Period: 300s — meaning CPU must stay above 75% for 10 consecutive minutes.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The minimum time required for the CloudWatch alarm to trigger is ______ minutes.',
        answer: '10 minutes (2 evaluation periods × 5 minutes each = 10 minutes sustained)'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each CloudFormation intrinsic function to its purpose.',
        items: [
          '!Ref → ?',
          '!GetAtt → ?',
          '!Sub → ?',
          'Fn::Base64 → ?'
        ],
        answer: '!Ref → Returns a resource ID or parameter value; !GetAtt → Retrieves a specific attribute of a resource; !Sub → Substitutes variables into strings; Fn::Base64 → Encodes data as Base64 (used for EC2 UserData).'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What happens if Fn::Base64 is omitted from the UserData section in a CloudFormation template?',
        options: [
          'A. Instance fails to launch',
          'B. Script runs normally without any issue',
          'C. Script may not execute correctly',
          'D. CloudFormation stack rolls back immediately'
        ],
        answer: 'C. Script may not execute correctly. EC2 UserData must be Base64-encoded. CloudFormation\'s Fn::Base64 handles this. Without it, the raw script may be passed incorrectly and fail silently at boot.'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which services are the two largest cost drivers? (Select ALL that apply)',
        options: [
          'A. EC2',
          'B. RDS',
          'C. S3',
          'D. CloudWatch'
        ],
        answer: 'A and B. EC2 (£410) and RDS (£210) are the largest cost items by far. S3 is £18.50 and CloudWatch is £8.20 — both minor in comparison.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Which is the BEST cost optimisation strategy for this architecture?',
        options: [
          'A. Remove the ALB',
          'B. Right-size EC2 and use Reserved Instances',
          'C. Disable DynamoDB',
          'D. Remove CloudWatch monitoring'
        ],
        answer: 'B. Right-size EC2 and use Reserved Instances. EC2 is £410 — the top cost. Reserved Instances can reduce this by up to 72%. Removing ALB or CloudWatch would damage availability and observability.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Users experience slow responses during a traffic spike before Auto Scaling reacts. What is the MOST likely cause?',
        options: [
          'A. Incorrect subnet configuration',
          'B. Cooldown and evaluation delay in the scaling process',
          'C. S3 lifecycle rule blocking requests',
          'D. DynamoDB partition key conflict'
        ],
        answer: 'B. Cooldown and evaluation delay. Auto Scaling is not instantaneous — CloudWatch must evaluate metrics over the alarm period, scaling policies have cooldowns, and new instances must launch and pass health checks before receiving traffic.'
      }
    ]
  }
];

const generatedScenarios = [
  {
    id: 'streamline',
    label: 'Generated scenario',
    title: 'StreamLine Media — Elastic Platform Recovery Drill',
    description: 'Extra practice scenario built in the same artefact-driven style.',
    source: 'Generated practice set.',
    artefacts: [
      {
        title: 'Artefact 1 — IAM Policy',
        content: `{
  "Effect": "Allow",
  "Action": ["ec2:DescribeInstances", "ec2:CreateSnapshot"],
  "Resource": "*"
},
{
  "Effect": "Deny",
  "Action": "ec2:TerminateInstances",
  "Resource": "*"
}`
      },
      {
        title: 'Artefact 2 — CLI Output',
        content: `{
  "InstanceId": "i-77stream",
  "State": {"Name": "running"},
  "PublicIpAddress": "18.202.44.10",
  "SubnetId": "subnet-public-a"
}`
      },
      {
        title: 'Artefact 3 — Auto Scaling',
        content: `Min: 2
Desired: 2
Max: 5
Scaling policy: add 1 instance when average CPU > 65%`
      },
      {
        title: 'Artefact 4 — Snapshot Recovery Notes',
        content: `1. Create snapshot from volume vol-123
2. Create new volume from snapshot
3. Attach volume to EC2
4. Mount file system`
      },
      {
        title: 'Artefact 5 — Load Balancer Health',
        content: `Targets healthy: 2/2
Listener: HTTP 80
Health check path: /health`
      }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'What action is explicitly blocked by the IAM policy?',
        options: [
          'A. Describing EC2 instances',
          'B. Creating snapshots',
          'C. Terminating instances',
          'D. Reading load balancer health'
        ],
        answer: 'C. Terminating instances'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The CLI output shows that the instance is publicly reachable in principle.',
        options: ['True', 'False'],
        answer: 'True'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The Auto Scaling group will add capacity when average CPU exceeds ________.',
        answer: '65%'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which steps belong to restoring data from the saved snapshot? (Select ALL that apply)',
        options: [
          'A. Create a new volume from the snapshot',
          'B. Attach the snapshot directly to the instance',
          'C. Attach the restored volume to EC2',
          'D. Mount the file system'
        ],
        answer: 'A, C, and D'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each item to its function.',
        items: [
          'Auto Scaling policy',
          'Health check path',
          'Snapshot',
          'Explicit Deny'
        ],
        answer: 'Auto Scaling policy → Adds capacity automatically; Health check path → Verifies application health; Snapshot → Point-in-time backup of a volume; Explicit Deny → Overrides any Allow.'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Place the recovery notes in the correct order.',
        items: [
          'Create snapshot from volume',
          'Create new volume from snapshot',
          'Attach volume to EC2',
          'Mount file system'
        ],
        answer: 'Create snapshot from volume → Create new volume from snapshot → Attach volume to EC2 → Mount file system'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'Why is the load balancer considered healthy?',
        options: [
          'A. The instance was terminated',
          'B. Two targets passed health checks',
          'C. Desired capacity is zero',
          'D. IAM allows snapshots'
        ],
        answer: 'B. Two targets passed health checks'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which clues point to availability rather than single-instance design? (Select ALL that apply)',
        options: [
          'A. Min capacity 2',
          'B. Targets healthy 2/2',
          'C. Explicit Deny on terminate',
          'D. Public IP present'
        ],
        answer: 'A and B'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The subnet shown in the CLI output is __________.',
        answer: 'subnet-public-a'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'If users cannot access the app, order a sensible first-pass check.',
        items: [
          'Check load balancer health',
          'Check instance state',
          'Check application health endpoint',
          'Check scaling policy behaviour'
        ],
        answer: 'Check instance state → Check load balancer health → Check application health endpoint → Check scaling policy behaviour'
      }
    ]
  },
  {
    id: 'cloudvault',
    label: 'Generated scenario 2',
    title: 'CloudVault — S3 Static Hosting & CloudFront',
    description: 'Extra practice scenario covering S3 static website hosting, CloudFront distributions, and IAM bucket policies.',
    source: 'Generated practice set.',
    artefacts: [
      {
        title: 'Artefact 1 — S3 Bucket Policy',
        content: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cloudvault-site/*"
    },
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:DeleteObject",
      "Resource": "arn:aws:s3:::cloudvault-site/*"
    }
  ]
}`
      },
      {
        title: 'Artefact 2 — CloudFront Distribution',
        content: `Domain: d1abc123.cloudfront.net
Origin: cloudvault-site.s3-website-eu-west-1.amazonaws.com
Price Class: PriceClass_100
Default Root Object: index.html
HTTPS: Redirect HTTP to HTTPS
Cache TTL: 86400 seconds`
      },
      {
        title: 'Artefact 3 — CLI Output (S3 Sync)',
        content: `aws s3 sync ./build s3://cloudvault-site --delete
upload: build/index.html to s3://cloudvault-site/index.html
upload: build/app.js to s3://cloudvault-site/app.js
delete: s3://cloudvault-site/old-page.html`
      },
      {
        title: 'Artefact 4 — Route 53 Record',
        content: `Type: CNAME
Name: www.cloudvault.io
Value: d1abc123.cloudfront.net
TTL: 300`
      },
      {
        title: 'Artefact 5 — IAM User Policy (CI/CD Bot)',
        content: `{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:ListBucket", "s3:DeleteObject"],
  "Resource": [
    "arn:aws:s3:::cloudvault-site",
    "arn:aws:s3:::cloudvault-site/*"
  ]
}`
      }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'A visitor browses to http://www.cloudvault.io. Based on the CloudFront configuration, what happens?',
        options: [
          'A. The request is blocked by the bucket policy',
          'B. The request is redirected to HTTPS automatically',
          'C. The request is served directly from S3',
          'D. The request times out because CloudFront is not configured'
        ],
        answer: 'B. The request is redirected to HTTPS automatically'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The S3 bucket policy allows any user on the internet to download objects from the cloudvault-site bucket.',
        options: ['True', 'False'],
        answer: 'True'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The CloudFront Default Root Object is set to __________. This means visiting the root URL will serve this file.',
        answer: 'index.html'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which actions can the CI/CD Bot IAM user perform on the cloudvault-site bucket? (Select ALL that apply)',
        options: [
          'A. Upload new files to the bucket',
          'B. List the contents of the bucket',
          'C. Delete objects from the bucket',
          'D. Create a new S3 bucket'
        ],
        answer: 'A, B, and C'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each component to its role in the deployment.',
        items: [
          'CloudFront → ?',
          'Route 53 CNAME → ?',
          'S3 Bucket → ?',
          'Cache TTL 86400 → ?'
        ],
        answer: 'CloudFront → Global CDN that caches and delivers content; Route 53 CNAME → Maps www.cloudvault.io to the CloudFront domain; S3 Bucket → Stores and serves the static website files; Cache TTL 86400 → Content is cached for 24 hours before re-fetching from origin.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'The CI/CD pipeline runs aws s3 sync ./build s3://cloudvault-site --delete. What does the --delete flag do?',
        options: [
          'A. Deletes the entire bucket after syncing',
          'B. Removes files in S3 that no longer exist in the local build folder',
          'C. Skips files that already exist in S3',
          'D. Permanently disables versioning on the bucket'
        ],
        answer: 'B. Removes files in S3 that no longer exist in the local build folder'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Place the steps to set up the CloudVault static site in the correct order:',
        items: [
          'Create the S3 bucket and enable static website hosting',
          'Apply the bucket policy to allow public read access',
          'Upload the website files using aws s3 sync',
          'Create the CloudFront distribution pointing to the S3 website endpoint',
          'Create the Route 53 CNAME record pointing to CloudFront'
        ],
        answer: '1. Create the S3 bucket and enable static website hosting → 2. Apply the bucket policy to allow public read access → 3. Upload the website files using aws s3 sync → 4. Create the CloudFront distribution pointing to the S3 website endpoint → 5. Create the Route 53 CNAME record pointing to CloudFront.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'CloudFront caches content at locations known as __________ (two words).',
        answer: 'edge locations'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'Based on the S3 bucket policy, a user can run aws s3 rm s3://cloudvault-site/index.html and successfully delete the file.',
        options: ['True', 'False'],
        answer: 'False'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which features of this architecture improve performance and availability for global users? (Select ALL that apply)',
        options: [
          'A. CloudFront edge caching reduces latency',
          'B. S3 static hosting has no single point of failure',
          'C. Route 53 CNAME adds additional compute capacity',
          'D. Cache TTL reduces repeated requests to the S3 origin'
        ],
        answer: 'A, B, and D'
      }
    ]
  },
  {
    id: 'securepay',
    label: 'Generated scenario 3',
    title: 'SecurePay — RDS, VPC & Encryption Compliance',
    description: 'Extra practice scenario covering RDS in a private subnet, encryption at rest, and VPC security controls.',
    source: 'Generated practice set.',
    artefacts: [
      {
        title: 'Artefact 1 — RDS Instance Details',
        content: `DB Identifier: securepay-db
Engine: MySQL 8.0
Instance Class: db.t3.medium
Multi-AZ: Enabled
Subnet Group: subnet-private-a, subnet-private-b
Publicly Accessible: No
Encryption at Rest: Enabled (KMS key: arn:aws:kms:eu-west-1:123456789:key/abc-123)
Automated Backups: 7-day retention`
      },
      {
        title: 'Artefact 2 — Security Group (DB-SG)',
        content: `Inbound Rules:
  MySQL/Aurora  TCP  3306  sg-app (App-SG only)
Outbound Rules:
  All Traffic   All  All   0.0.0.0/0`
      },
      {
        title: 'Artefact 3 — VPC Layout',
        content: `VPC CIDR: 172.16.0.0/16
Public Subnet A:  172.16.1.0/24 (eu-west-1a) — EC2 App Server
Public Subnet B:  172.16.2.0/24 (eu-west-1b) — EC2 App Server
Private Subnet A: 172.16.3.0/24 (eu-west-1a) — RDS Primary
Private Subnet B: 172.16.4.0/24 (eu-west-1b) — RDS Standby`
      },
      {
        title: 'Artefact 4 — IAM Policy (DBA Role)',
        content: `{
  "Effect": "Allow",
  "Action": [
    "rds:DescribeDBInstances",
    "rds:CreateDBSnapshot",
    "rds:RestoreDBInstanceFromDBSnapshot"
  ],
  "Resource": "*"
},
{
  "Effect": "Deny",
  "Action": "rds:DeleteDBInstance",
  "Resource": "*"
}`
      },
      {
        title: 'Artefact 5 — CloudWatch Alarm',
        content: `Alarm Name: securepay-cpu-high
Metric: CPUUtilization
Threshold: > 80% for 5 consecutive minutes
Action: Send SNS notification to dba-team@securepay.io`
      }
    ],
    questions: [
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'A developer attempts to connect to securepay-db directly from their laptop over the internet. What will happen?',
        options: [
          'A. The connection succeeds because port 3306 is open',
          'B. The connection is refused because the DB is not publicly accessible',
          'C. The connection is redirected through CloudFront',
          'D. The connection succeeds because Multi-AZ is enabled'
        ],
        answer: 'B. The connection is refused because the DB is not publicly accessible'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'Multi-AZ deployment means the RDS instance is replicated across two Availability Zones for high availability.',
        options: ['True', 'False'],
        answer: 'True'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The DB-SG security group only allows inbound MySQL traffic from __________.',
        answer: 'sg-app (App-SG)'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which actions can the DBA Role perform on the RDS database? (Select ALL that apply)',
        options: [
          'A. View details of existing DB instances',
          'B. Create a manual DB snapshot',
          'C. Restore a DB from a snapshot',
          'D. Permanently delete the DB instance'
        ],
        answer: 'A, B, and C'
      },
      {
        type: 'Matching',
        marks: 2,
        text: 'Match each RDS configuration item to its purpose.',
        items: [
          'Multi-AZ: Enabled → ?',
          'Publicly Accessible: No → ?',
          'Encryption at Rest → ?',
          'Automated Backups (7-day) → ?'
        ],
        answer: 'Multi-AZ → Provides automatic failover to a standby replica in another AZ; Publicly Accessible: No → Prevents direct internet access to the database; Encryption at Rest → Protects stored data using a KMS key; Automated Backups → Allows point-in-time recovery up to 7 days ago.'
      },
      {
        type: 'Multiple Choice',
        marks: 2,
        text: 'The CloudWatch alarm fires. What happens next?',
        options: [
          'A. The RDS instance is automatically restarted',
          'B. An SNS notification is sent to the DBA team email',
          'C. The DB-SG security group is modified automatically',
          'D. The RDS instance is terminated and replaced'
        ],
        answer: 'B. An SNS notification is sent to the DBA team email'
      },
      {
        type: 'Ordering',
        marks: 2,
        text: 'Place the steps to restore the securepay-db from a snapshot in the correct order:',
        items: [
          'Identify the correct DB snapshot to restore from',
          'Run rds:RestoreDBInstanceFromDBSnapshot with the snapshot ARN',
          'Update the application connection string to point to the new instance endpoint',
          'Verify the restored instance is in the "available" state',
          'Test database connectivity from the App-SG security group'
        ],
        answer: '1. Identify the correct DB snapshot to restore from → 2. Run rds:RestoreDBInstanceFromDBSnapshot with the snapshot ARN → 3. Verify the restored instance is in the "available" state → 4. Update the application connection string to point to the new instance endpoint → 5. Test database connectivity from the App-SG security group.'
      },
      {
        type: 'Fill in the Blank',
        marks: 2,
        text: 'The RDS standby replica is located in __________ (give the subnet or AZ name from the artefacts).',
        answer: 'Private Subnet B / eu-west-1b'
      },
      {
        type: 'True/False',
        marks: 2,
        text: 'The DBA Role IAM policy allows a DBA to delete the securepay-db instance if needed for maintenance.',
        options: ['True', 'False'],
        answer: 'False'
      },
      {
        type: 'Multiple Answer',
        marks: 2,
        text: 'Which design choices in this architecture address security compliance requirements? (Select ALL that apply)',
        options: [
          'A. RDS placed in private subnets with no public access',
          'B. Encryption at rest using a KMS key',
          'C. Security group restricting DB access to App-SG only',
          'D. CloudWatch alarm monitoring CPU utilisation'
        ],
        answer: 'A, B, and C'
      }
    ]
  }
];

function createQuestionCard(question, scenarioId, index) {
  const questionId = `${scenarioId}-${index}`;
  const type = question.type;
  const fullAnswer = question.answer || '';
  const hasOptions = !!question.options;
  const isMulti = type === 'Multiple Answer';

  let optionsHtml = '';
  if (hasOptions) {
    optionsHtml = `
      <div class="option-list" data-qid="${questionId}" data-multi="${isMulti}" data-answered="false">
        ${question.options.map((opt, i) => `
          <button class="option-btn" data-option-index="${i}" data-qid="${questionId}" aria-pressed="false">${opt}</button>
        `).join('')}
      </div>
      <div class="option-actions" id="opt-actions-${questionId}" style="display:none;">
        ${isMulti ? `<button class="btn btn-primary submit-multi-btn" data-qid="${questionId}">Check answers</button>` : ''}
      </div>`;
  }

  const itemsSource = question.items ? (type === 'Matching' ? 'match-list' : 'order-list') : '';
  const itemsHtml = question.items
    ? `<div class="${itemsSource}">${question.items.map(item =>
        `<div class="${type === 'Matching' ? 'match-item' : 'order-item'}">${item}</div>`).join('')}</div>`
    : '';

  // Non-option questions still get a reveal button
  const revealBtn = !hasOptions
    ? `<button class="reveal-btn" data-answer-toggle="${questionId}">Reveal answer</button>
       <button class="toggle-btn" data-mark-correct="${questionId}">Mark as studied</button>`
    : `<button class="reveal-btn reset-btn" data-reset-qid="${questionId}" style="display:none;">↺ Try again</button>`;

  return `
    <article class="question-card" id="card-${questionId}">
      <div class="question-top">
        <div>
          <span class="meta-chip">${type}</span>
          <span class="meta-chip">${question.marks} marks</span>
        </div>
        <span class="q-status-badge" id="badge-${questionId}"></span>
      </div>
      <p class="question-text">Question ${index + 1} — ${question.text}</p>
      ${optionsHtml}
      ${itemsHtml}
      <div class="question-actions">${revealBtn}</div>
      <div class="answer-box" id="${questionId}">
        <p class="answer-label">Correct answer &amp; reasoning</p>
        <p>${fullAnswer}</p>
      </div>
    </article>
  `;
}


function createScenarioCard(scenario, isOpen = false) {
  return `
    <article class="scenario-card">
      <div class="scenario-header">
        <div>
          <p class="section-kicker">${scenario.label}</p>
          <h4>${scenario.title}</h4>
          <p>${scenario.description}</p>
        </div>
        <button class="toggle-btn" data-scenario-toggle="${scenario.id}">${isOpen ? 'Hide scenario' : 'Open scenario'}</button>
      </div>
      <div class="scenario-collapsible ${isOpen ? 'open' : ''}" id="scenario-${scenario.id}">
        <div class="scenario-body">
          <div class="note-banner">
            <strong>Source note:</strong> ${scenario.source}
          </div>
          <div class="artefact-grid">
            ${scenario.artefacts.map(artefact => `
              <article class="artefact-card">
                <h5>${artefact.title}</h5>
                <pre>${artefact.content}</pre>
              </article>
            `).join('')}
          </div>
          <div class="question-list">
            ${scenario.questions.map((question, index) => createQuestionCard(question, scenario.id, index)).join('')}
          </div>
          <p class="footer-note">Tip: Treat the artefacts like the real assessment. The answer is usually hiding in a keyword, field, command, or workflow clue.</p>
        </div>
      </div>
    </article>
  `;
}

function renderScenarios() {
  const officialContainer = document.getElementById('officialScenarios');
  const generatedContainer = document.getElementById('generatedScenarios');

  officialContainer.innerHTML = officialScenarios.map((scenario, index) => createScenarioCard(scenario, index === 0)).join('');
  generatedContainer.innerHTML = generatedScenarios.map(scenario => createScenarioCard(scenario, true)).join('');
}

function setupViews() {
  const navButtons = document.querySelectorAll('.side-link');
  const viewSections = document.querySelectorAll('.view-section');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.viewTarget;
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      viewSections.forEach(section => {
        const match = section.id === target;
        section.classList.toggle('visible-view', match);
        section.classList.toggle('hidden-view', !match);
      });
    });
  });
}

function setupScenarioToggles() {
  document.addEventListener('click', (event) => {
    const scenarioToggle = event.target.closest('[data-scenario-toggle]');
    if (scenarioToggle) {
      const id = scenarioToggle.dataset.scenarioToggle;
      const content = document.getElementById(`scenario-${id}`);
      const isOpen = content.classList.toggle('open');
      scenarioToggle.textContent = isOpen ? 'Hide scenario' : 'Open scenario';
      return;
    }

    const answerToggle = event.target.closest('[data-answer-toggle]');
    if (answerToggle) {
      const answerId = answerToggle.dataset.answerToggle;
      const answerBox = document.getElementById(answerId);
      const willShow = !answerBox.classList.contains('show');
      answerBox.classList.toggle('show');
      answerToggle.classList.toggle('active', willShow);
      answerToggle.textContent = willShow ? 'Hide answer' : 'Reveal answer';

      if (willShow && !appState.revealed.has(answerId)) {
        appState.revealed.add(answerId);
        appState.answered += 1;
        updateProgress();
      }
      return;
    }

    const studiedToggle = event.target.closest('[data-mark-correct]');
    if (studiedToggle) {
      const active = studiedToggle.classList.toggle('active');
      studiedToggle.textContent = active ? 'Studied ✓' : 'Mark as studied';
      appState.correct += active ? 1 : -1;
      if (appState.correct < 0) appState.correct = 0;
      updateProgress();
      return;
    }

    // ── Single-select option button (Multiple Choice / True/False) ──
    const optBtn = event.target.closest('.option-btn');
    if (optBtn) {
      const qid = optBtn.dataset.qid;
      const listEl = document.querySelector(`.option-list[data-qid="${qid}"]`);
      if (!listEl || listEl.dataset.answered === 'true') return;
      const isMulti = listEl.dataset.multi === 'true';

      if (!isMulti) {
        listEl.dataset.answered = 'true';
        const q = findQuestion(qid);
        const fullAnswer = q ? q.answer : '';
        const chosenLetter = optBtn.textContent.trim().split('.')[0].trim().toUpperCase();
        const isCorrect = fullAnswer.toUpperCase().includes(chosenLetter + '.');

        listEl.querySelectorAll('.option-btn').forEach(btn => {
          const bLetter = btn.textContent.trim().split('.')[0].trim().toUpperCase();
          btn.classList.add(fullAnswer.toUpperCase().includes(bLetter + '.') ? 'option-correct' : 'option-wrong-neutral');
          btn.disabled = true;
        });
        optBtn.classList.remove('option-wrong-neutral');
        optBtn.classList.add(isCorrect ? 'option-correct' : 'option-wrong');
        resolveQuestion(qid, isCorrect, fullAnswer);
      } else {
        optBtn.classList.toggle('option-selected');
        optBtn.setAttribute('aria-pressed', optBtn.classList.contains('option-selected') ? 'true' : 'false');
        const actionsEl = document.getElementById(`opt-actions-${qid}`);
        if (actionsEl) actionsEl.style.display = 'block';
      }
      return;
    }

    // ── Submit multi-answer ──
    const submitMulti = event.target.closest('.submit-multi-btn');
    if (submitMulti) {
      const qid = submitMulti.dataset.qid;
      const listEl = document.querySelector(`.option-list[data-qid="${qid}"]`);
      if (!listEl || listEl.dataset.answered === 'true') return;
      listEl.dataset.answered = 'true';

      const q = findQuestion(qid);
      const fullAnswer = q ? q.answer : '';
      const correctLetters = [...fullAnswer.toUpperCase().matchAll(/\b([A-D])\b/g)].map(m => m[1]);
      const selectedLetters = [...listEl.querySelectorAll('.option-btn.option-selected')]
                                .map(b => b.textContent.trim().split('.')[0].trim().toUpperCase());
      const isCorrect = correctLetters.length === selectedLetters.length &&
                        correctLetters.every(l => selectedLetters.includes(l));

      listEl.querySelectorAll('.option-btn').forEach(btn => {
        const bLetter = btn.textContent.trim().split('.')[0].trim().toUpperCase();
        if (correctLetters.includes(bLetter)) btn.classList.add('option-correct');
        else if (btn.classList.contains('option-selected')) btn.classList.add('option-wrong');
        else btn.classList.add('option-wrong-neutral');
        btn.disabled = true;
      });
      const actionsEl = document.getElementById(`opt-actions-${qid}`);
      if (actionsEl) actionsEl.style.display = 'none';
      resolveQuestion(qid, isCorrect, fullAnswer);
      return;
    }

    // ── Try again (reset) ──
    const resetBtn = event.target.closest('[data-reset-qid]');
    if (resetBtn) {
      const qid = resetBtn.dataset.resetQid;
      const listEl = document.querySelector(`.option-list[data-qid="${qid}"]`);
      if (!listEl) return;
      listEl.dataset.answered = 'false';
      listEl.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('option-correct', 'option-wrong', 'option-wrong-neutral', 'option-selected');
        btn.disabled = false;
        btn.setAttribute('aria-pressed', 'false');
      });
      const ansBox = document.getElementById(qid);
      if (ansBox) ansBox.classList.remove('show');
      const badge = document.getElementById(`badge-${qid}`);
      if (badge) { badge.textContent = ''; badge.className = 'q-status-badge'; }
      const card = document.getElementById(`card-${qid}`);
      if (card) card.classList.remove('card-correct', 'card-wrong');
      resetBtn.style.display = 'none';
      const actionsEl = document.getElementById(`opt-actions-${qid}`);
      if (actionsEl) actionsEl.style.display = 'none';
      appState.revealed.delete(qid);
      return;
    }
  });

  document.getElementById('expandAllOfficial').addEventListener('click', () => {
    officialScenarios.forEach(({ id }) => {
      const content = document.getElementById(`scenario-${id}`);
      const btn = document.querySelector(`[data-scenario-toggle="${id}"]`);
      if (content && btn) {
        content.classList.add('open');
        btn.textContent = 'Hide scenario';
      }
    });
  });

  document.getElementById('collapseAllOfficial').addEventListener('click', () => {
    officialScenarios.forEach(({ id }) => {
      const content = document.getElementById(`scenario-${id}`);
      const btn = document.querySelector(`[data-scenario-toggle="${id}"]`);
      if (content && btn) {
        content.classList.remove('open');
        btn.textContent = 'Open scenario';
      }
    });
  });
}

function updateProgress() {
  const answeredEl = document.getElementById('answeredCount');
  const correctEl = document.getElementById('correctCount');
  const totalEl = document.getElementById('totalCount');
  const progressBar = document.getElementById('progressBar');

  if (answeredEl) answeredEl.textContent = appState.answered;
  if (correctEl) correctEl.textContent = appState.correct;
  if (totalEl) totalEl.textContent = appState.total;
  if (progressBar) progressBar.style.width = `${(appState.answered / appState.total) * 100}%`;
}

function setupThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const icon = document.getElementById('themeIcon');
  let theme = 'light';

  theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  function applyTheme(next) {
    theme = next;
    root.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  applyTheme('light');

  toggle.addEventListener('click', () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  });
}

// ─── CRASH COURSE DATA ───────────────────────────────────────────────────────
const crashCourseTopics = [
  {
    id: 'cc-strategy',
    icon: '🎯',
    title: 'Exam Strategy',
    colour: 'teal',
    points: [
      'This exam tests reading & understanding systems — not memorising definitions.',
      'Step 1: Identify the artefact type (CLI, JSON policy, Bash script, Config block).',
      'Step 2: Identify key words — null, Deny, subnet, encryption, CPU threshold.',
      'Step 3: Apply logic — follow the flow of data and connectivity.',
      'Everything you need to answer the question is already IN the question.'
    ]
  },
  {
    id: 'cc-networking',
    icon: '🌐',
    title: 'Networking (VPC)',
    colour: 'blue',
    points: [
      'Public Subnet = has a Public IP + Route Table points to an Internet Gateway (IGW).',
      'Private Subnet = no Public IP + Route Table points to a NAT Gateway (outbound only).',
      'Critical path: Create VPC → Create Subnets → Attach IGW → Update Route Table (0.0.0.0/0 → IGW) → Associate Subnet.',
      'Common pitfall: Creating a subnet but forgetting to associate it with the correct Route Table.',
      'JSON tell: "PublicIpAddress": null + "SubnetId": "subnet-private" = NOT internet accessible.'
    ]
  },
  {
    id: 'cc-sg',
    icon: '🔒',
    title: 'Security Groups',
    colour: 'orange',
    points: [
      'Security Groups are STATEFUL — return traffic is automatically allowed.',
      'They operate at the INSTANCE level (not subnet level).',
      'HTTP: Port 80 | HTTPS: Port 443 | SSH: Port 22 | RDP: Port 3389 | MySQL: Port 3306.',
      'SSH source should NEVER be 0.0.0.0/0 in production — use your IP or VPC CIDR.',
      'Database SG source should be the Web Server\'s Security Group ID (e.g. sg-web), NOT an IP range.',
      'Explicit Deny in IAM ALWAYS overrides Allow — even if another statement allows it.'
    ]
  },
  {
    id: 'cc-iam',
    icon: '🪪',
    title: 'IAM',
    colour: 'purple',
    points: [
      'Principle of Least Privilege — grant only the permissions required.',
      'Explicit Deny ALWAYS overrides Allow — no exceptions.',
      'Conditions restrict permissions even when an Allow exists (e.g. "aws:RequestedRegion": "eu-west-2").',
      'IAM onboarding order: Create user → Assign to group → Generate credentials → Test access.',
      'ec2:Describe* = read-only. ec2:* = full access. s3:* on prod with Deny = blocked even with Allow on dev.'
    ]
  },
  {
    id: 'cc-ec2',
    icon: '🖥️',
    title: 'EC2 & User Data',
    colour: 'green',
    points: [
      'User Data scripts bootstrap instances on FIRST BOOT ONLY — restarting does NOT re-run them.',
      'Scripts must start with #!/bin/bash and run as root (sudo).',
      'Debug User Data: check /var/log/cloud-init-output.log on the instance.',
      'Key Pairs: required for SSH. Losing the .pem file = permanent loss of access.',
      'CLI pattern: aws ec2 run-instances --image-id ... --subnet-id ... --security-group-ids ... --user-data file://script.sh',
      'Instance in public subnet + has Public IP + SG allows port 22 = SSH accessible.'
    ]
  },
  {
    id: 'cc-storage',
    icon: '🗄️',
    title: 'Storage',
    colour: 'yellow',
    points: [
      'EBS (Block): Like a hard drive. Attached to ONE EC2. Must be in the SAME Availability Zone. New volumes must be formatted + mounted in the OS.',
      'io2: High-performance, predictable IOPS (e.g. 12,000 IOPS). Expensive. For intensive workloads.',
      'gp3: General-purpose. Cheaper. Lower guaranteed IOPS unless explicitly configured.',
      'S3 (Object): Like Dropbox. Globally unique bucket names. Block Public Access is ON by default.',
      'S3 Lifecycle: Standard → Standard-IA (at 30 days) → Glacier (at 90 days) → Deleted (at 365 days).',
      'EFS (File): Shared network drive for multiple EC2 instances.',
      'Glacier: Long-term archive storage. Key identifiers: "archive" / "lifecycle".'
    ]
  },
  {
    id: 'cc-rds',
    icon: '🗃️',
    title: 'Databases (RDS & DynamoDB)',
    colour: 'teal',
    points: [
      'RDS: Relational/SQL database. Place in PRIVATE subnets. Use Multi-AZ for high availability.',
      'Multi-AZ RDS: Primary + standby. Automatic failover. Same endpoint maintained.',
      'RDS Security Group: Allow MySQL (Port 3306) from the Web Server SG only — not 0.0.0.0/0.',
      'DynamoDB: NoSQL. Partition key (HASH) = PatientId. Sort key (RANGE) = Timestamp.',
      'DynamoDB query efficiency: always query using the Partition Key. Scanning the whole table is expensive.',
      'PAY_PER_REQUEST = auto scaling. PROVISIONED = you define read/write capacity units.'
    ]
  },
  {
    id: 'cc-scaling',
    icon: '📈',
    title: 'Scaling & Load Balancing',
    colour: 'blue',
    points: [
      'Auto Scaling Group (ASG): Launch Template defines WHAT to launch. ASG settings define WHERE and WHEN.',
      'DesiredCapacity cannot exceed MaxSize — ASG will cap at the maximum.',
      'Scale-out cooldown is SHORTER than scale-in cooldown (react fast, scale back cautiously).',
      'CPU → CloudWatch Alarm → Auto Scaling action.',
      'ALB (Application Load Balancer): Distributes traffic. Uses health checks. Removes unhealthy instances.',
      'ALB terminates HTTPS (port 443) and forwards as HTTP (port 80) to instances inside VPC.',
      'Health check timing: Unhealthy threshold × Interval = time to mark unhealthy (e.g. 2 × 30s = 60s).',
      'CloudWatch alarm trigger: requires sustained breach — e.g. 2 evaluation periods × 5 min = 10 min total.'
    ]
  },
  {
    id: 'cc-automation',
    icon: '⚙️',
    title: 'Automation & Infrastructure as Code',
    colour: 'orange',
    points: [
      'CloudFormation: Infrastructure as Code. Defines security groups, instances, user data, and more.',
      '!Ref → returns a resource ID or name.',
      '!GetAtt → retrieves a specific attribute of a resource.',
      '!Sub → substitutes variable placeholders in strings.',
      'Fn::Base64 → encodes UserData so EC2 can execute it. Omitting it may cause scripts not to run.',
      'For repeated behaviour (deployments, alarms): always consider Lambda or EventBridge.',
      'Automation chain: CPU spike → CloudWatch Alarm → Auto Scaling → new EC2 launched.'
    ]
  },
  {
    id: 'cc-troubleshoot',
    icon: '🔧',
    title: 'Troubleshooting Checklists',
    colour: 'red',
    subsections: [
      {
        label: '❌ Can\'t SSH (Connection Timed Out)',
        steps: [
          'Does the Security Group allow Port 22 from your IP?',
          'Is the instance in a Public Subnet?',
          'Does the Route Table point to an Internet Gateway?',
          'Does the instance have a Public IP assigned?'
        ]
      },
      {
        label: '❌ Database Unreachable (Connection Refused)',
        steps: [
          'Is the RDS instance in "running" state?',
          'Does the RDS Security Group allow Port 3306?',
          'Is the inbound source set to the Web Server SG (not 0.0.0.0/0)?',
          'Are the EC2 and RDS in the same VPC?'
        ]
      },
      {
        label: '❌ User Data Didn\'t Run',
        steps: [
          'User Data only runs on FIRST boot — did you restart instead of re-launch?',
          'Does the script start with #!/bin/bash?',
          'Does the instance have internet access (IGW or NAT) to install packages?',
          'Check: /var/log/cloud-init-output.log'
        ]
      },
      {
        label: '❌ Website Not Loading',
        steps: [
          'Check security group — is Port 80 (HTTP) open to 0.0.0.0/0?',
          'Verify route table — does the public subnet route to IGW?',
          'Confirm the instance has a Public IP.',
          'Check Apache/Nginx status on the instance.',
          'Review user data logs for bootstrap errors.'
        ]
      }
    ]
  },
  {
    id: 'cc-ports',
    icon: '🔢',
    title: 'Port Numbers Cheat Sheet',
    colour: 'purple',
    table: [
      ['Port', 'Protocol', 'Use'],
      ['22', 'TCP', 'SSH — Linux remote access'],
      ['80', 'TCP', 'HTTP — Web traffic (unencrypted)'],
      ['443', 'TCP', 'HTTPS — Web traffic (encrypted)'],
      ['3306', 'TCP', 'MySQL / Aurora database'],
      ['3389', 'TCP', 'RDP — Windows remote access'],
      ['5432', 'TCP', 'PostgreSQL database']
    ]
  },
  {
    id: 'cc-costopt',
    icon: '💰',
    title: 'Cost Optimisation',
    colour: 'green',
    points: [
      'Always optimise the LARGEST cost driver first (typically EC2, then RDS).',
      'Right-size instances — don\'t pay for capacity you don\'t use.',
      'Use Reserved Instances for predictable long-running workloads.',
      'S3 Lifecycle rules automatically move data to cheaper storage classes over time.',
      'Scale IN during off-peak hours — ASG + scheduled scaling reduces idle EC2 cost.',
      'DynamoDB PAY_PER_REQUEST is better for unpredictable traffic vs over-provisioning.'
    ]
  }
];

function getColourClass(colour) {
  const map = {
    teal: 'cc-teal', blue: 'cc-blue', orange: 'cc-orange',
    purple: 'cc-purple', green: 'cc-green', yellow: 'cc-yellow',
    red: 'cc-red'
  };
  return map[colour] || 'cc-teal';
}

function renderCrashCourse() {
  const container = document.getElementById('crashcourse-content');
  if (!container) return;

  let html = '<div class="cc-grid">';

  crashCourseTopics.forEach(topic => {
    const colClass = getColourClass(topic.colour);
    html += `<div class="cc-card ${colClass}">`;
    html += `<div class="cc-card-header"><span class="cc-icon">${topic.icon}</span><h3 class="cc-title">${topic.title}</h3></div>`;
    html += `<div class="cc-card-body">`;

    if (topic.points) {
      html += '<ul class="cc-list">';
      topic.points.forEach(p => { html += `<li>${p}</li>`; });
      html += '</ul>';
    }

    if (topic.subsections) {
      topic.subsections.forEach(sub => {
        html += `<div class="cc-sub"><p class="cc-sub-label">${sub.label}</p><ol class="cc-steps">`;
        sub.steps.forEach(s => { html += `<li>${s}</li>`; });
        html += '</ol></div>';
      });
    }

    if (topic.table) {
      html += '<table class="cc-table"><thead><tr>';
      topic.table[0].forEach(h => { html += `<th>${h}</th>`; });
      html += '</tr></thead><tbody>';
      topic.table.slice(1).forEach(row => {
        html += '<tr>';
        row.forEach((cell, i) => {
          html += i === 0 ? `<td><strong>${cell}</strong></td>` : `<td>${cell}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
    }

    html += '</div></div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

// Hook crash course rendering into view switching

// ── Helpers for interactive questions ─────────────────────────────────────────
function findQuestion(qid) {
  const all = [...officialScenarios, ...generatedScenarios];
  for (const scenario of all) {
    for (let i = 0; i < scenario.questions.length; i++) {
      if (`${scenario.id}-${i}` === qid) return scenario.questions[i];
    }
  }
  return null;
}

function resolveQuestion(qid, isCorrect, fullAnswer) {
  const answerBox = document.getElementById(qid);
  if (answerBox) answerBox.classList.add('show');

  const badge = document.getElementById(`badge-${qid}`);
  if (badge) {
    badge.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
    badge.className = `q-status-badge ${isCorrect ? 'badge-correct' : 'badge-wrong'}`;
  }

  const card = document.getElementById(`card-${qid}`);
  if (card) card.classList.add(isCorrect ? 'card-correct' : 'card-wrong');

  const resetBtn = document.querySelector(`[data-reset-qid="${qid}"]`);
  if (resetBtn) resetBtn.style.display = 'inline-flex';

  if (!appState.revealed.has(qid)) {
    appState.revealed.add(qid);
    appState.answered += 1;
    if (isCorrect) appState.correct += 1;
    updateProgress();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const origNavButtons = document.querySelectorAll('.side-link');
  origNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.viewTarget === 'crashcourse') renderCrashCourse();
    });
  });
});

renderScenarios();
setupViews();
setupScenarioToggles();
setupThemeToggle();
updateProgress();